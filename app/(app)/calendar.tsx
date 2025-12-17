/* 
    Viser kalender med helligdager, arrangementer og kommende hendelser
*/

import { Colors } from "@/constants/theme";
import { CalendarEvent, CalendarHoliday } from "@/types/calendar";
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Konfiguerer norsk locale
LocaleConfig.locales["nb"] = {
    monthNames: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
    monthNamesShort: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"],
    dayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"],
    dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
    today: "I dag"
};

LocaleConfig.defaultLocale = "nb";

/*
    Eksempler på hendelser. ansatte vil kunne legge til.
    Rollebasert tilgang er ikke implementert i løsningen vår, 
    Men dette er et eksempel på hvordan det ville blitt brukt
*/
const events: CalendarEvent[] = [
    { date: "2025-12-18", title: "Foreldremøte" },
    { date: "2025-12-19", title: "Julaavslutning", description: "Alle familiemedlemmer er velkommen" },
];

export default function CalendarPage() {
    // State for valgt dato, helligdager, innlastning og info om valgt dag
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [holidays, setHolidays] = useState<CalendarHoliday[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInfoTitle, setSelectedInfoTitle] = useState<string | null >(null);
    const [selectedInfoLines, setSelectedInfoLines] = useState<string[] | null>(null);

    const today = new Date().toISOString().slice(0, 10);

    // Henter offentlige helligdager for gjeldende år
    useEffect(() => {
        const year = new Date().getFullYear();

        const fetchHolidays = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/NO`);
                const data = await response.json();

                const mapspedHolidays: CalendarHoliday[] = data.map((item: any) => ({
                    date: item.date,
                    localName: item.localName,
                }));
                
                setHolidays(mapspedHolidays);
                setIsLoading(false);
            } catch (e) {
                console.error("Error fetching holidays:", e);
            }
        }
        fetchHolidays();
    }, []);

    // Marker dagens dato, helligdager og arrangementer
    const markedDates: { [date: string]: any } = {};

    markedDates[today] = { 
        ...(markedDates[today] || {}),
        marked: true,
        dotColor: Colors.light.primary,
    };

    holidays.forEach(holiday => {
        markedDates[holiday.date] = {
            ...(markedDates[holiday.date] || {}),
            marked: true,
            dotColor: Colors.light.accent,
        };
    });

    events.forEach(event => {
        markedDates[event.date] = {
            ...(markedDates[event.date] || {}),
            marked: true,
            dotColor: Colors.light.primary,
        };
    });

    if (selectedDate) {
        markedDates[selectedDate] = {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: Colors.light.primary,
        };
    }

    // Kombinerer helligdager og arrangementer til kommende hendelser
    const upcomingEvents = (() => {
        const todayString = today;

        const holidayEvents = holidays.map((holiday) => ({
            date: holiday.date,
            title: holiday.localName,
            type: "Helligdag" as const,
        }));

        const extraEvents = events.map((event) => ({
            date: event.date,
            title: event.title,
            type: "Arrangement" as const,
        }));

        return [...holidayEvents, ...extraEvents]
            .filter((event) => event.date >= todayString)
            .sort((a, b) => (a.date > b.date ? 1 : -1))
            .slice(0, 5);
    })();

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={26} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Kalender</Text>
                <View style={{ width: 24 }} />
            </View>
            {/* Kalenderkomponent */}
            <View style={styles.card}>

                {isLoading && (
                    <ActivityIndicator style={{marginBottom: 8}} size="small" />
                )}

                <Calendar 
                    onDayPress={ (day) => { 
                        const dateString = day.dateString
                        setSelectedDate(dateString)
                        
                        const holidaysForDay = holidays.filter((holiday) => holiday.date === dateString);
                        const eventsForDay = events.filter((event) => event.date === dateString);

                        const infoLines: string[] = [];

                        holidaysForDay.forEach((holiday) => {
                            infoLines.push(`Helligdag: ${holiday.localName}`);
                        });

                        eventsForDay.forEach((event) => {
                            if (event.description) {
                                infoLines.push(event.title);
                                infoLines.push(event.description)
                            } else {
                                infoLines.push(event.title);
                            }
                        });

                        if (infoLines.length === 0) {
                            setSelectedInfoTitle(null);
                            setSelectedInfoLines(null);
                        } else {
                            const label = new Date(dateString).toLocaleDateString("nb-NO", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long"
                            });
                            setSelectedInfoTitle(label);
                            setSelectedInfoLines(infoLines);
                        }
                    }}
                    markedDates={markedDates}
                    enableSwipeMonths={true}
                    style={styles.calendar}
                    theme={{
                        arrowColor: Colors.light.primary,
                        textDayFontWeight: "600",
                        textMonthFontWeight: "700",
                        textDayHeaderFontWeight: "600",
                    }}
                />
            </View>
            {/* Info om valgt dato */}
            {selectedInfoTitle && selectedInfoLines && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>{selectedInfoTitle}</Text>
                    {selectedInfoLines.map((line, index) => (
                        <Text key={index} style={styles.infoText}>{line}</Text>
                    ))}
                </View>
        
            )}

            {/* Liste med kommende hendelser */}
            <View style={styles.eventsContainer}>
                <Text style={styles.eventsHeader}>Kommende hendelser</Text>
                {upcomingEvents.length === 0 ? (
                    <Text style={styles.noEventsText}>Ingen kommende hendelser.</Text>
                ) : (
                    <FlatList 
                        data={upcomingEvents}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            const eventDate = new Date(item.date);
                            const formattedDate = eventDate.toLocaleDateString("nb-NO", {
                                day: "2-digit",
                                month: "long",
                            });
                            return (
                                <Text style={styles.eventItem}>
                                    {formattedDate}: {item.title} 
                                </Text>
                            );
                        }}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.surfaceSoft,
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    headerRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "600",
    },
    card: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    calendar: {
        borderRadius: 16,
    },
    infoBox: {
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 0.2,
        borderColor: Colors.light.mutedText,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    infoText: {
        fontSize: 15,
        marginBottom: 4,
    },
    eventsContainer: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },
    eventsHeader: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        color: Colors.light.text,
    },
    noEventsText: {
        fontSize: 14,
        color: Colors.light.mutedText,
    },
    eventItem: {
        fontSize: 16,
        marginBottom: 8,
    },
});
/* 
  Side som viser GDPR og personvern for SafeDrop.
  Alle lenkene kan klikkes på og åpnes i nettleser. 
*/

import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PrivacyPage() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={26} color="black" style={{ marginLeft: 12}} />
        </Pressable>
        <Text style={styles.header}>GDPR og Personvern i SafeDrop</Text>
        <View style={{ width: 32 }} />
      </View>
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.paragraph}>
            SafeDrop er utviklet for trygg og lovlig håndtering av
            personopplysninger i barnehager. Les mer om vårt personvern nedenfor:
          </Text>

          <Text style={styles.paragraph}>
            SafeDrop følger gjeldende norsk og europeisk personvernlovgivning.
            Personopplysningsloven (2018), GDPR, Barnehageloven og retningslinjer
            fra Utdanningsdirektoratet (Udir). Barnehagen er behandlingsansvarlig,
            mens SafeDrop er databehandler på vegne av barnehagen (GDPR art.4 og
            28)
          </Text>

          <Text style={styles.subHeader}>Hvilke opplysninger behandles?</Text>
          <Text style={styles.paragraph}>
            SafeDrop behandler kun opplysninger som er nødvendige for levering og
            henting av barn i barnehagen. Dette gjøres i tråd med prinsippet om
            dataminimering (GDPR art. 5). Dataene vi samler inn, hashes via en
            moderne og sikker løsning i skyen og inkluderer:
          </Text>

          <Text style={styles.listItem}>• Navn på forelder og barn</Text>
          <Text style={styles.listItem}>• E-post og passord (forelder)</Text>
          <Text style={styles.listItem}>• Profilbilde (forelder, valgfritt)</Text>
          <Text style={styles.listItem}>• Rolle (foresatt / ansatt)</Text>
          <Text style={styles.listItem}>• Antall registrerte barn</Text>
          <Text style={styles.listItem}>• Alder og avdeling (barn)</Text>
          <Text style={styles.listItem}>• Allergier for barn</Text>
          <Text style={styles.listItem}>• Status (sjekket inn / hentet)</Text>
          <Text style={styles.listItem}>• Aktivitetshistorikk for barn</Text>

          <Text style={styles.subHeader}>
            Rettslig grunnlag for databehandlingen (GDPR art.6)
          </Text>
          <Text style={styles.paragraph}>
            SafeDrop behandler data med rettslig grunnlag på basis av å utføre en
            oppgave i allmennhetens interesse, og for å kunne oppfylle barnehagens
            rettslige forpliktelser. Det er derfor ingen krav om samtykke for
            behandling som er nødvendig for å utføre lovpålagte kjerneoppgaver i
            barnehagen. Dette støttes av norsk praksis og Udir-veiledning.
          </Text>

          <Text style={styles.subHeader}>Barns personvern (GDPR art. 8)</Text>
          <Text style={styles.paragraph}>
            Barn har et særlig vern etter GDPR. SafeDrop er derfor designet for å
            begrense innsamling av data til kun det nødvendige, kun gi tilgang til
            autoriserte personer, og hindre bruk av data til andre formål enn
            drift og sikkerhet.
          </Text>

          <Text style={styles.subHeader}>Dine rettigheter</Text>
          <Text style={styles.listItem}>• Innsyn i opplysninger (art. 15)</Text>
          <Text style={styles.listItem}>• Retting av feil (art. 16)</Text>
          <Text style={styles.listItem}>
            • Sletting når vilkår er oppfylt (art. 17)
          </Text>
          <Text style={styles.listItem}>
            • Begrensning av behandling i visse tilfeller (art. 18)
          </Text>

          <Text style={styles.paragraph}>
            SafeDrop er bygget for å ivareta barnets sikkerhet, foreldres tillit
            og barnehagens lovpålagte ansvar i tråd med GDPR, norsk lov og
            nasjonale retningslinjer.
          </Text>

          {/* Kildeliste med klikkbare lenker */}
          <Text style={styles.subHeader}>Kildeliste</Text>
          <Pressable
            onPress={() =>
              Linking.openURL("https://eur-lex.europa.eu/eli/reg/2016/679/oj")
            }
          >
            <Text style={[styles.listItem, styles.linkText]}>
              • European Parliament and Council. (2016). Regulation (EU) 2016/679.
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Linking.openURL(
                "https://www.udir.no/regelverk-og-tilsyn/personvern-for-barnehage-og-skole/"
              )
            }
          >
            <Text style={[styles.listItem, styles.linkText]}>
              • Utdanningsdirektoratet. (u.å.). Personvern i barnehage og skole.
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Linking.openURL("https://lovdata.no/dokument/NL/lov/2018-06-15-38")
            }
          >
            <Text style={[styles.listItem, styles.linkText]}>
              • Lov om behandling av personopplysninger (personopplysningsloven).
              (2018). Lovdata.
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Linking.openURL("https://lovdata.no/dokument/NL/lov/2005-06-17-64")
            }
          >
            <Text style={[styles.listItem, styles.linkText]}>
              • Lov om barnehager (barnehageloven). (2005). Lovdata.
            </Text>
          </Pressable>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 12,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

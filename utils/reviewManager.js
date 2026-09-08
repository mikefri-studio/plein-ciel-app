import { StoreReview } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLE_COMPTEUR = 'pleinciel_session_count';
const CLE_DEMANDE = 'pleinciel_review_asked';

// Demande un avis : 3e ouverture de l'appli, UNE seule fois dans la vie de l'appli
export async function maybeRequestReview() {
  try {
    const dejaDemande = await AsyncStorage.getItem(CLE_DEMANDE);
    if (dejaDemande === 'true') return;

    const compteur = parseInt((await AsyncStorage.getItem(CLE_COMPTEUR)) || '0', 10) + 1;
    await AsyncStorage.setItem(CLE_COMPTEUR, String(compteur));

    if (compteur >= 3 && StoreReview.isAvailable) {
      StoreReview.requestReview();
      await AsyncStorage.setItem(CLE_DEMANDE, 'true');
    }
  } catch (e) {
    // Silencieux : ne jamais bloquer l'appli pour un avis
  }
}

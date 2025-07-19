import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResponse } from './mockApi'; // Import AnalysisResponse

const HISTORY_KEY = 'history';

export interface PhotoAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  analysisData: AnalysisResponse; // Changed to AnalysisResponse
}

export async function saveAnalysisResult(result: PhotoAnalysisResult): Promise<void> {
  try {
    const existingHistory = await getAnalysisHistory();
    const newHistory = [result, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving analysis result:', error);
  }
}

export async function getAnalysisHistory(): Promise<PhotoAnalysisResult[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting analysis history:', error);
    return [];
  }
}

export async function clearAnalysisHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing analysis history:', error);
  }
}
export async function deleteAnalysisResult(id: string): Promise<void> {
  try {
    const existingHistory = await getAnalysisHistory();
    const newHistory = existingHistory.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error deleting analysis result:', error);
  }
}
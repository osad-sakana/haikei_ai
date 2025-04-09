/**
 * アプリケーション全体で使用するエラーハンドリングユーティリティ
 */

export enum ErrorType {
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
}

/**
 * エラーをアプリケーション固有の形式に変換する
 * @param error - 発生したエラー
 * @returns アプリケーション固有のエラー形式
 */
export const createAppError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message.includes('API')) {
      return {
        type: ErrorType.API_ERROR,
        message: 'APIリクエストに失敗しました。APIキーを確認してください。',
        originalError: error,
      };
    }
    if (error.message.includes('network')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'ネットワーク接続に問題が発生しました。',
        originalError: error,
      };
    }
  }
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: '予期せぬエラーが発生しました。',
    originalError: error,
  };
};

/**
 * エラーメッセージをユーザーフレンドリーな形式に変換する
 * @param error - アプリケーションエラー
 * @returns ユーザーフレンドリーなエラーメッセージ
 */
export const getErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.API_ERROR:
      return 'APIリクエストに失敗しました。APIキーを確認してください。';
    case ErrorType.VALIDATION_ERROR:
      return '入力内容に問題があります。';
    case ErrorType.NETWORK_ERROR:
      return 'ネットワーク接続に問題が発生しました。';
    default:
      return '予期せぬエラーが発生しました。';
  }
}; 
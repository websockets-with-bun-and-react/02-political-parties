import type { WebsocketResponse } from '../types/index';

const createErrorResponse = (error: string): WebsocketResponse => {
  return {
    type: 'ERROR',
    payload: { error },
  };
};

export const handlerMessage = (message: string): WebsocketResponse => {
  try {
    const jsonData = JSON.parse(message);
    console.log('payload: ', jsonData);

    const { type, payload } = jsonData;

    switch (type) {
      case 'ADD_PARTY':
        return {
          type: 'PARTY_ADDED',
          payload: [],
        };
      default:
        return createErrorResponse('Unknown message type');
    }
  } catch (error) {
    return createErrorResponse('Invalid JSON format');
  }
};

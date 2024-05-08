package donation.main.service.impl;

import donation.main.exception.ApplicationException;
import donation.main.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;

@Service
@RequiredArgsConstructor
public class TelegramNotificationServiceImpl implements NotificationService {
    private final TelegramClient telegramClient;
    @Value("${telegram.chat.id}")
    private String chatId;

    @Override
    public void sendMessage(String message) {
        try {
            telegramClient.execute(SendMessage
                    .builder()
                    .chatId(chatId)
                    .text(message)
                    .build());
        } catch (TelegramApiException e) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST,
                    "Can't send message to TG chat with id: " + chatId + ". Cause: " + e.getMessage());
        }
    }
}

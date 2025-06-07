package com.kma.shop.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class  EmailService {
    JavaMailSender mailSender;
    SpringTemplateEngine templateEngine;

    public void signupVerify(String email, String code) throws MessagingException {
        MimeMessage mimeMessage  = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setSubject("Signup verification");
        helper.setTo(email);
        Context context = new Context();
        context.setVariable("subject", "This is you verification code");
        context.setVariable("message", code);
        String htmlContent = templateEngine.process("emailTemplate", context);
        helper.setText(htmlContent, true); // true = nội dung là HTML
        mailSender.send(mimeMessage);
    }



    public void test() throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setTo("hoanghuutuyen06022004@gmail.com");
        helper.setSubject("Signup verification");
        Context context = new Context();
        context.setVariable("subject", "Hello World, This is Subject");
        context.setVariable("message", "Hello World, This is Text");
        String htmlContent = templateEngine.process("emailTemplate", context);
        helper.setText(htmlContent, true); // true = nội dung là HTML
        mailSender.send(mimeMessage);
    }
}
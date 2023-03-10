package org.severstal.mdwiki.dto.person;

import java.util.Date;

/**
 * DTO сущности Person для ответа
 */
public class PersonResponse {

    /**
     * ID пользователя в базе данных
     */
    private int id;

    /**
     * Логин пользователя
     */
    private String username;

    /**
     * Имя пользователя
     */
    private String name;

    /**
     * Email пользователя
     */
    private String email;

    /**
     * Точное время создания пользователя
     */
    private Date createdAt;

    /**
     * Точное время обновления пользователя
     */
    private Date updatedAt;

    /**
     * Тип аккаунта
     * Активный (true) или заблокированный (false)
     */
    private boolean enabled;

    /**
     * Текст заметки markdown-документа
     */
    private String note;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

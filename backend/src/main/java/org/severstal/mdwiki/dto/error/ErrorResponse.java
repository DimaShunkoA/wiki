package org.severstal.mdwiki.dto.error;

import java.time.Instant;
import java.util.List;

/**
 * DTO для ответа об ошибках.
 */
public class ErrorResponse {

    /**
     * Список ошибок.
     */
    private final List<String> errors;

    /**
     * Конструктор для создания объекта исключения.
     *
     * @param errors    список ошибок.
     */

    public ErrorResponse(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}

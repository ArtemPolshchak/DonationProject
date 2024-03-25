package donation.main.validation.impl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import donation.main.validation.FieldMatch;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class FieldMatchImpl implements ConstraintValidator<FieldMatch, Object> {
    private String fieldName;
    private String fieldMatchName;

    @Override
    public void initialize(FieldMatch constraintAnnotation) {
        fieldName = constraintAnnotation.fieldName();
        fieldMatchName = constraintAnnotation.fieldMatchName();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        BeanWrapper wrapper = new BeanWrapperImpl(value);
        Object field = wrapper.getPropertyValue(fieldName);
        Object fieldMatch = wrapper.getPropertyValue(fieldMatchName);
        if (field != null) {
            return field.equals(fieldMatch);
        }
        return fieldMatch == null;
    }
}

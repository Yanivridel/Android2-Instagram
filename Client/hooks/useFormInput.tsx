import { Address } from "@/types/other";
import { useState } from "react";

// Custom hook for handling form input and errors
export function useFormInput<T>(initialValues: T) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

    // Handle changes to input fields (including checkbox)
    const handleInputChange = (field: keyof T, val: string | boolean | Address | null) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: val,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: "",
            api: "",
        }));
    };

    const setErrorByFields = (errors: { [key: string]: string | boolean }) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...errors
        }));
    };

    return {
        values,
        errors,
        handleInputChange,
        setErrorByFields,
        setErrors,
    };
}

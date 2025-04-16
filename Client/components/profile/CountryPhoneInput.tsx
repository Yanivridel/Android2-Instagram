import React, { useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react-native";
import { countryCodes } from "@/utils/constants/countries";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Box } from "../ui/box";
import { useTheme } from "@/utils/Themes/ThemeProvider";
import { signUpInputs } from "@/types/NavigationTypes";

interface CountryPhoneInputProps {
    phoneNumber: string;
    setPhoneNumber?: (val: string) => void;
    updateField?: (field: string, value: string) => void;
    prefix?: string;
    setPrefix?: (val: string) => void;
    error?: string;
    setError?: (val: string) => void;
}

const CountryPhoneInput = ({ phoneNumber, updateField, setPhoneNumber, prefix, setPrefix, error, setError}: CountryPhoneInputProps) => {
    const { appliedTheme } = useTheme();
    const [selectedCountry, setSelectedCountry] = useState(() => 
        countryCodes.find(country => prefix === country.code) || { code: "+972", label: "Israel", flag: "🇮🇱" });
    
    const onChangeText = (text: string) => {
        if(setError) setError("");
        // If need prefix
        if(setPrefix) setPrefix(selectedCountry.code);
        // Select Update Method
        if(updateField)
            return updateField("phoneNumber", text.replace(/[^0-9]/g, ''))
        if(setPhoneNumber)
            return setPhoneNumber(text);
        return null;
    }

    return (
        <Box className="flex flex-col gap-2">        
            <Box className="flex flex-row flex-wrap gap-2 items-center ">
                {/* Country Code Select */}
                <Select
                    selectedValue={selectedCountry.code}
                    onValueChange={(val) => {
                        const country = countryCodes.find(c => c.code === val);
                        if (country) setSelectedCountry(country);
                        if(setPrefix) setPrefix(val);
                    }}
                >
                    <SelectTrigger className={`w-fit px-1 border-0 bg-input-${appliedTheme} rounded-lg h-[55px]`}>
                        <SelectInput className={`text-text-${appliedTheme}`}
                        placeholder={selectedCountry.flag + " " + selectedCountry.label}
                        value={selectedCountry.flag + " " + selectedCountry.label}
                        pointerEvents="none"
                        />
                        <SelectIcon className="mr-2" as={ChevronDownIcon} />
                    </SelectTrigger>

                    <SelectPortal className="">
                        <SelectBackdrop />
                        <SelectContent className={`max-h-[400px] bg-card-${appliedTheme} `}>
                            <SelectDragIndicatorWrapper className="">
                                <SelectDragIndicator className=""/>
                            </SelectDragIndicatorWrapper>
                            
                            <ScrollView className="w-full ">
                                {countryCodes.map((country) => (
                                    <SelectItem
                                        key={country.code + country.label}
                                        label={country.flag + " " + country.label}
                                        value={country.code}
                                        className={`selected:bg-red-500 ${selectedCountry.code === country.code ? "bg-red-500 text-white" : "text-text-${appliedTheme}"}`}
                                        textStyle={{ className: `text-text-${appliedTheme}` }}
                                        style= { { backgroundColor: "transparent"} }
                                    />
                                ))}
                            </ScrollView>
                        </SelectContent>
                    </SelectPortal>
                </Select>

                {/* Phone Number Input */}
                <View className="relative flex-1 min-w-[150px]">
                    <TextInput
                        className={`rounded-lg bg-input-${appliedTheme} text-text-${appliedTheme} h-[55px]`}
                        keyboardType="phone-pad"
                        maxLength={11}
                        style={{ paddingLeft: selectedCountry.code.length * 8 + 24 }}
                        value={phoneNumber}
                        onChangeText={onChangeText}
                        placeholder="Phone number"
                        placeholderTextColor={`rgba(251, 253, 255, 0.48)`} 
                    />
                    
                    <Text className={`absolute left-3 top-[27.5px] -translate-y-1/2 text-text-${appliedTheme}`}>
                        {selectedCountry.code + " |"}
                    </Text>
                </View>
                {error && <Text className="text-red-500 text-sm ps-3  mb-1 mt-2 w-full">{error}</Text>}
                
            </Box>
        </Box>
    )
};

export default CountryPhoneInput;
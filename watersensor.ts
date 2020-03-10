/**
* Makecode extension for Dissolved Oxygen Sensor
*/

namespace SGBotic{

    let pH_midCal = 1500;
    let pH_lowCal = 2030;
    let pH_highCal = 975;

    let DO_DEFAULT_SAT_VOLTAGE = 1460; //value in mV
    let do_full_sat_voltage = DO_DEFAULT_SAT_VOLTAGE;
    
    //100% DO saturation value at temperature from 20degC to 39degC
    //25degC is 8.24mg/L
    //https://dnr.mo.gov/env/esp/wqm/DOSaturationTable.htm
    let MaxDOConcentrationSatTable: number[] = [9.07, 8.90, 8.72, 8.56, 8.40, 8.24, 8.09, 7.95, 7.81, 7.67, 7.54, 7.41, 7.28, 7.16, 7.05, 6.93, 6.82, 6.71, 6.61, 6.51]
    
    /**
     * Return the open air calibration value. 
     * @param Read the DO 100% saturation in mV
     */
     //% subcategory=Water-Sensor
    //%blockId="GET_ANALOG_INPUT"  block="read analog input (mV) %pinarg"
    //% pinarg.defl=AnalogPin.P0
    //% weight=100 blockExternalInputs=true blockGap=30
    export function get_analog_input(pinarg: AnalogPin): number {
        let voltage_mV = 0;
        
        //get 8 samples
        for (let i = 0; i < 8; i++) {
            voltage_mV += pins.analogReadPin(pinarg) / 1024.0 * 3000.0;
        }
        
        return (voltage_mV >> 3)
    }
    
    /**
     * Set pH low calibration value. 
     * @param Set pH low calibration in mV
     */
     //% subcategory=Water-Sensor
    //%blockId="SET_PH_LOW_CALI"  block="ph low calibration mV %calValue"
    //% calValue.defl=2030
    //% weight=95 blockExternalInputs=true blockGap=10
    export function set_ph_low_cal(calValue: number): void {
        pH_lowCal = calValue
    }
    
    
    /**
     * Set pH mid calibration value. 
     * @param Set pH mid calibration in mV
     */
     //% subcategory=Water-Sensor
    //%blockId="SET_PH_MID_CALI"  block="ph mid calibration mV %calValue"
    //% calValue.defl=1500
    //% weight=94 blockExternalInputs=true blockGap=10
    export function set_ph_mid_cal(calValue: number): void {
        pH_midCal = calValue
    }
    
    /**
     * Set pH high calibration value. 
     * @param Set pH high calibration in mV
     */
     //% subcategory=Water-Sensor
    //%blockId="SET_PH_HIGH_CALI"  block="ph high calibration mV %calValue"
    //% calValue.defl=975
    //% weight=93 blockExternalInputs=true blockGap=10
    export function set_ph_high_cal(calValue: number): void {
        pH_highCal = calValue
    }
    
     /**
     * Return the pH value. 
     * @param Read the pH value
     */
     //% subcategory=Water-Sensor
    //%blockId="PH_SENSOR_GET_VALUE"  block="pH value %pinarg"
    //%pinarg.fieldEditor="gridpicker" pinarg.fieldOptions.columns=3
    //% pinarg.defl=AnalogPin.P0
    //% weight=90 blockExternalInputs=true blockGap=30
    export function ph_value(pinarg: AnalogPin): number {
        let voltage_mV = 0;
        let phvalue = 0;
        
        //get 8 samples
        for (let i = 0; i < 8; i++) {
            voltage_mV += pins.analogReadPin(pinarg) / 1024.0 * 3000.0;
        }
        
        //compute average of 8 samples
         voltage_mV = voltage_mV >> 3
         
         if (voltage_mV > pH_midCal) { //high voltage = low ph
            phvalue =  7.0 - 3.0 / (pH_lowCal - pH_midCal) * (voltage_mV - pH_midCal);
        } else {
            phvalue =  7.0 - 3.0 / (pH_midCal - pH_highCal) * (voltage_mV - pH_midCal);
        }
        
        //phvalue = Math.round(phvalue * 100);
        
        return phvalue;
    }
    
    
    
    
    
    /**
     * Set the open air calibration value. 
     * @param Set the DO 100% saturation value
     * @param to improve the accuracy of the DO% value.
     */
     //% subcategory=Water-Sensor
    //% blockId="SET_DO_SENSOR_CALIBRATION"  
    //% block="set DO 100-percent saturation (mV) %calValue"
    //% calValue.defl=1490
    //% weight=85 blockExternalInputs=true blockGap=10
    export function set_open_air_cal(calValue: number):void{
        do_full_sat_voltage = calValue;
    }
    
    
    /**
     * Return the DO% value. 
     * @param Read hte DO% value
     */
     //% subcategory=Water-Sensor
    //%blockId="DO_SENSOR_GET_VALUE"  block="DO value at %temperature degC|%pinarg"
    //%pinarg.fieldEditor="gridpicker" pinarg.fieldOptions.columns=3
    //% pinarg.defl=AnalogPin.P1
    //% temperature.defl=25
    //% temperature.min=20 temperature.max=39
    export function DO_value(temperature: number, pinarg: AnalogPin): number {
        let voltage_mV = 0;
        let analogInput = 0;
        let dovalue = 0;
        
        //get 8 samples
        for (let i = 0; i < 8; i++) {
            //voltage_mV += pins.analogReadPin(pinarg) / 1024.0 * 3000.0;
            analogInput += pins.analogReadPin(pinarg)
        }
        
        analogInput = analogInput >> 3;
        voltage_mV = analogInput * 3000.0 / 1024.0
        
        dovalue = MaxDOConcentrationSatTable[Math.round(temperature) - 20] * voltage_mV / do_full_sat_voltage
       
        return dovalue;
    }
    
    
   


}
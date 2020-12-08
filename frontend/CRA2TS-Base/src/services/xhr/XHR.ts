import axios, { AxiosResponse } from 'axios';
import ICountries, { initialState } from '../../components/countries/ICountries';
import { COUNTRIES_URL } from '../../env';

console.log(`Node Environment:  ${process.env.NODE_ENV}`);
console.log(`Listings URL:  ${COUNTRIES_URL}`);

export class XHR {

    private static instance: XHR;

    private constructor(
        private _countries: ICountries[],
        private _callback: any
    ) {
    }

    public static getInstance() {
        if (!XHR.instance) {
            XHR.instance = new XHR(
                initialState,
                () => true
            );
        }
        return this.instance;
    }

    private async GetCountries(): Promise<ICountries[]> {
        return new Promise((resolve, reject) => {
            axios.get(COUNTRIES_URL).then((response: AxiosResponse) => {
                resolve(response.data);
            });
        });
    }

    public async DoGetCountries() {
        await this.GetCountries().then((countries: ICountries[]) => {
            this._countries = countries;
            this._callback(this._countries);
        });
    }

    public get Countries() {
        return this._countries;
    }

    public set callback(callback: any) {
        this._callback = callback;
    }
} 
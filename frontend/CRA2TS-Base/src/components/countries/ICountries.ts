export default interface ICountries {
    heading: string;
    type: string;
    year: string;
    price: string;
    location: string;
    hull: string;
    engine: string;
    yw: string;
    photos: string[];
    broker: string;
    summary: string;
}

export const initialState: ICountries[] = [];
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './components/navbar/Navbar';
import CountriesGrid from './components/countries/countries';
import Footer from './components/footer/Footer';

export default function App() {

    return (
        <div className="App">

            <NavBar />

            <Switch>
                <Route path="/countries">
                    <CountriesGrid />
                </Route>
            </Switch>

            <Footer />
        </div>
    );
}
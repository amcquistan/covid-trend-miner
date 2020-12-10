import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './components/navbar/Navbar';
import CountriesGrid from './components/countries/countries';
import ExampleChart from './components/charts/example/example';
import Footer from './components/footer/Footer';
import { BrowserRouter } from 'react-router-dom';

export default function App() {

    return (
        <div className="App">

            <NavBar />

            <BrowserRouter>
                <Switch>
                    <Route path="/countries">
                        <CountriesGrid />
                    </Route>
                    <Route path="/chart">
                        <ExampleChart />
                    </Route>
                    <Route>
                        <ExampleChart />
                    </Route>
                </Switch>
            </BrowserRouter>

            <Footer />
        </div>
    );
}

import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import AppointDeputyPage from './pages/admin/AppointDeputyPage';
import DeputiesPage from './pages/admin/DeputiesPage';
import AdminElectionPage from './pages/admin/ElectionPage';
import AdminElectionsPage from './pages/admin/ElectionsPage';
import NewAdminPage from './pages/admin/NewAdminPage';
import AdminNewCandidatePage from './pages/admin/NewCandidatePage';
import AdminNewConstituencyPage from './pages/admin/NewConstituencyPage';
import NewDeputyPage from './pages/admin/NewDeputyPage';
import NewElectionPage from './pages/admin/NewElectionPage';
import NewRegionPage from './pages/admin/NewRegionPage';
import DeputyElectionPage from './pages/deputy/ElectionPage';
import DeputyElectionsPage from './pages/deputy/ElectionsPage';
import DeputyNewCandidatePage from './pages/deputy/NewCandidatePage';
import DeputyNewConstituencyPage from './pages/deputy/NewConstituencyPage';
import UserElectionPage from './pages/ElectionPage';
import UserElectionsPage from './pages/ElectionsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewAlliancePage from './pages/NewAlliancePage';
import NewPartyPage from './pages/NewPartyPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ResultsPage from './pages/ResultsPage';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomePage} exact />
          <Route path='/login' component={LoginPage} />
          <Route path='/register' component={RegisterPage} />
          <Route path='/elections' component={UserElectionsPage} exact />
          <Route path='/elections/:id' component={UserElectionPage} />
          <Route path='/profile' component={ProfilePage} />
          <Route path='/results/:id' component={ResultsPage} />
          <Route path='/admin/elections' component={AdminElectionsPage} exact />
          <Route path='/admin/elections/:id' component={AdminElectionPage} />
          <Route
            path='/admin/new-constituency/:id'
            component={AdminNewConstituencyPage}
          />
          <Route
            path='/admin/new-candidate/:id'
            component={AdminNewCandidatePage}
          />
          <Route path='/new-election' component={NewElectionPage} />
          <Route path='/deputies' component={DeputiesPage} />
          <Route path='/new-deputy' component={NewDeputyPage} />
          <Route path='/new-admin' component={NewAdminPage} />
          <Route path='/new-region/:id' component={NewRegionPage} />
          <Route path='/new-alliance/:id' component={NewAlliancePage} />
          <Route path='/new-party/:id' component={NewPartyPage} />

          <Route path='/appoint-deputy/:id' component={AppointDeputyPage} />
          <Route
            path='/deputy/elections'
            component={DeputyElectionsPage}
            exact
          />
          <Route path='/deputy/elections/:id' component={DeputyElectionPage} />
          <Route
            path='/deputy/new-constituency/:id'
            component={DeputyNewConstituencyPage}
          />
          <Route
            path='/deputy/new-candidate/:id'
            component={DeputyNewCandidatePage}
          />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

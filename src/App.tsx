import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import FloatingContact from "@/components/FloatingContact";
import Index from "./pages/Index";
import Destinations from "./pages/Destinations";
import Packages from "./pages/Packages";
import Experiences from "./pages/Experiences";
import ExperiencesDetails from "./pages/ExperiencesDetails";
import TripBuilder from "./pages/TripBuilder";
import Testimonials from "./pages/Testimonials";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PackageDetails from './pages/PackageDetails';
import DestinationDetails from './pages/DestinationDetails';
import DestinationTrips from './pages/DestinationTrips';
import DestinationTrip from './pages/DestinationTrip';
import Login from './pages/Login';
import HeroSectionEditor from './pages/dashboard/HeroSectionEditor';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <PageTransition>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/destinations" element={<Destinations />} />
                      <Route path="/destinations/:id" element={<DestinationDetails />} />
<Route path="/destinations-trips/:destinationId" element={<DestinationTrips />} />
<Route path="/trips/:tripId" element={<DestinationTrip />} />
                      <Route path="/packages" element={<Packages />} />
                      <Route path="/packages/:id" element={<PackageDetails />} />
                      <Route path="/experiences" element={<Experiences />} />
<Route path="/experiences/:id" element={<ExperiencesDetails />} />
                      <Route path="/tripbuilder" element={<TripBuilder />} />
                      <Route path="/testimonials" element={<Testimonials />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/dashboard/herosection-editor" element={<HeroSectionEditor />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  </PageTransition>
                  {/* Floating contact buttons (phone + WhatsApp) */}
                  <FloatingContact />
                  <Footer />
                </div>
              } />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

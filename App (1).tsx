import { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { TripEntryForm } from "./components/TripEntryForm";
import { TravelerDetailsForm } from "./components/TravelerDetailsForm";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { CheckCircle, Home, MapPin } from "lucide-react";
import { Badge } from "./components/ui/badge";

type Screen =
  | "dashboard"
  | "trip-form"
  | "traveler-form"
  | "success";

interface TripData {
  tripNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  travelMode: string;
  purpose: string;
  numberOfTravelers: string;
  additionalNotes: string;
}

interface Traveler {
  id: string;
  ageGroup: string;
  gender: string;
  relation: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("dashboard");
  const [tripData, setTripData] = useState<TripData | null>(
    null,
  );
  const [travelerData, setTravelerData] = useState<Traveler[]>(
    [],
  );

  const handleTripSubmit = (data: TripData) => {
    // Generate a trip number
    const tripNumber = `TRP${Date.now().toString().slice(-6)}`;
    const tripWithId = { ...data, tripNumber };

    setTripData(tripWithId);

    // If only one traveler, go directly to success
    if (parseInt(data.numberOfTravelers) === 1) {
      setTravelerData([
        {
          id: "1",
          ageGroup: "Not specified",
          gender: "Not specified",
          relation: "Self",
        },
      ]);
      setCurrentScreen("success");
    } else {
      setCurrentScreen("traveler-form");
    }
  };

  const handleTravelerComplete = (travelers: Traveler[]) => {
    setTravelerData(travelers);
    setCurrentScreen("success");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
    setTripData(null);
    setTravelerData([]);
  };

  const SuccessScreen = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-green-100 rounded-full p-3 w-fit mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-900">
          Trip Data Submitted Successfully!
        </CardTitle>
        <p className="text-muted-foreground">
          Thank you for contributing to Kerala's transportation
          planning research.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {tripData && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Trip ID
              </span>
              <Badge variant="secondary">
                {tripData.tripNumber}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>
                {tripData.origin} → {tripData.destination}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Travel Mode
              </span>
              <span>{tripData.travelMode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Travelers
              </span>
              <span>
                {tripData.numberOfTravelers}{" "}
                {parseInt(tripData.numberOfTravelers) === 1
                  ? "person"
                  : "people"}
              </span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-900 mb-2">
            What happens next?
          </h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>
              • Your data is securely stored and anonymized
            </li>
            <li>
              • NATPAC researchers will analyze travel patterns
            </li>
            <li>
              • Insights help improve transportation
              infrastructure
            </li>
            <li>
              • No personal information is shared or published
            </li>
          </ul>
        </div>

        <Button
          onClick={handleBackToDashboard}
          className="w-full"
          size="lg"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {currentScreen === "dashboard" && (
          <Dashboard
            onNewTrip={() => setCurrentScreen("trip-form")}
          />
        )}

        {currentScreen === "trip-form" && (
          <TripEntryForm onSubmit={handleTripSubmit} />
        )}

        {currentScreen === "traveler-form" && tripData && (
          <TravelerDetailsForm
            numberOfTravelers={parseInt(
              tripData.numberOfTravelers,
            )}
            onComplete={handleTravelerComplete}
            onBack={() => setCurrentScreen("trip-form")}
          />
        )}

        {currentScreen === "success" && <SuccessScreen />}
      </main>
    </div>
  );
}
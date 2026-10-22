import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] max-w-lg mx-auto">
      <Card className="text-center p-6 w-full">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg">Page Not Found</CardTitle>
          <CardDescription>
            The requested validation bureau route or resource does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="h-4 w-4" />
              Return to Command Centre
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

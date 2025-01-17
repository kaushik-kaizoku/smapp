import { useState, useEffect } from 'react';
import { User, AtSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BACKEND_URL } from '@/config';
import { Modal } from '@/components/ui/modal';

interface Submission {
  name: string;
  socialHandle: string;
  images: { url: string }[];
}

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const fetchSubmissions = async () => {
    try {
      const jwt = localStorage.getItem('token');
      if (!jwt) {
        console.error("Token is missing from localStorage");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/api/users`,{
        method: 'GET',
        headers: {
          Authorization:`Bearer ${jwt}` 
      }
      });
      const data = await response.json();
      setSubmissions(data.users || []);
      setError(null);
    } catch (err: unknown) {
      console.error("Fetch Error:", err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const pollInterval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <Alert className="m-4 bg-red-50"><AlertDescription>{error}</AlertDescription></Alert>;
  if (submissions.length === 0) return <div className="text-center p-4">{submissions.length}No submissions found.</div>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map(({ name, socialHandle, images }) => (
              <Card key={name} className="overflow-hidden">
                <CardHeader>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <AtSign className="w-4 h-4" />
                      <span>{socialHandle}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="aspect-square relative">
                        <img
                          src={`${BACKEND_URL.replace(/\/$/, '')}${image.url}`}
                          alt={`Upload ${index + 1} by ${name}`}
                          className="object-cover w-full h-full rounded cursor-pointer"
                          onClick={() =>
                            openImageModal(`${BACKEND_URL.replace(/\/$/, "")}${image.url}`)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <Modal isOpen={!!selectedImage} onClose={closeModal}>
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-full rounded"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Upload, User, AtSign, ImagePlus } from 'lucide-react';
import { Card, CardContent,  CardHeader, CardTitle } from "../components/ui/card";
import { Alert,  AlertDescription } from "../components/ui/alert";
import { BACKEND_URL } from '@/config';
import { Header } from '@/layout/Header';


const UserSubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string; socialHandle: string; images: File[] }>({
    name: '',
    socialHandle: '',
    images: []
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('socialHandle', formData.socialHandle);
    formData.images.forEach((image) => {
      data.append('images', image); 
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/submit`, {
        method: 'POST',
        body: data, 
      });
      console.log(response.json());
      setSubmitStatus({ type: 'success', message: 'Submission successful!' });
      setFormData({ name: '', socialHandle: '', images: [] });
    } catch (error) {
      console.log(error);
      setSubmitStatus({ type: 'error', message: 'Error submitting form. Please try again.' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({ ...prev, images: files }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Submit Your Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              <span>Social Media Handle</span>
            </label>
            <input
              type="text"
              value={formData.socialHandle}
              onChange={(e) => setFormData(prev => ({ ...prev, socialHandle: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4" />
              <span>Upload Images</span>
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        {submitStatus.message && (
          <Alert className={`mt-4 ${submitStatus.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertDescription>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const UserSubmission = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Header />
      <UserSubmissionForm />
    </div>
  );
};

export default UserSubmission;

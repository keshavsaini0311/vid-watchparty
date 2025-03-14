"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle2, XCircle, Video } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';
import { useSocket } from '@/app/context/SocketContext';
import { toast } from 'sonner';

function page() {
  const socket = useSocket();
  const router = useRouter();
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formdata, setformdata] = useState({
    vidurl: "",
    id: "",
  });

  useEffect(() => {
    const getuserid = async () => {
      try {
        const response = await fetch('/api/me');
        const data = await response.json();
        if(data.success){
          setformdata({ ...formdata, id: data.user._id });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getuserid();
  }, [setformdata]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = formdata.id;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformdata({ ...formdata, vidurl: downloadURL });
        });
      }
    );
  };

  const handlesubmit = async (event) => {
    event.preventDefault();
    try {
      // Generate a random 6-character room ID
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create room through socket
      socket.emit('createRoom', roomId, formdata.id, formdata.vidurl);
      // Redirect to the new room
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-black dark:from-black dark:to-black py-12 px-4">
      <div className="container mx-auto">
        <Card className="max-w-2xl mx-auto p-8 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Create Watch Party
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Upload your video and start watching together
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-4">
              <div
                onClick={() => fileRef.current.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${fileUploadError 
                    ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 hover:bg-red-100/50 dark:hover:bg-red-900/30' 
                    : 'border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-900/70'
                  }
                  hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 dark:hover:border-primary/50
                `}
              >
                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="video/*"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      MP4, WebM, or Ogg (max 500MB)
                    </p>
                  </div>
                </div>
              </div>

              {filePerc > 0 && filePerc < 100 && (
                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading: {filePerc}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${filePerc}%` }}
                    />
                  </div>
                </div>
              )}

              {filePerc === 100 && !fileUploadError && (
                <div className="flex items-center justify-center gap-2 text-green-500 bg-green-50/50 dark:bg-green-900/20 p-4 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Upload complete!</span>
                </div>
              )}

              {fileUploadError && (
                <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50/50 dark:bg-red-900/20 p-4 rounded-lg">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Upload failed. Please try again.</span>
                </div>
              )}
            </div>

            {formdata.vidurl !== "" && (
              <Button
                onClick={handlesubmit}
                className="relative w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group/btn"
              >
                <span className="relative z-10">Go to Room</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default page;

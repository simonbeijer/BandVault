'use client';

import InputField from '@/components/inputField';
import Button from '@/components/button';
import { useState, type ChangeEvent } from 'react';

const AddSong = () => {
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    setFileError('');
    
    if (!file) {
      return;
    }

    if (!file.type.startsWith('audio/')) {
      setFileError('Please select an audio file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File too large. Maximum size is 5MB');
      return;
    }

    setMusicFile(file);
  };

  const addSong = async () => {

    setTitleError(false);
    setFileError('');
    setSuccess(false);

    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    if (!musicFile) {
      setFileError('Please select an audio file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', musicFile);
      formData.append('title', title);

      const res = await fetch('/api/songs', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Song created:', data);
        
        // Clear form
        setTitle('');
        setMusicFile(null);
        setSuccess(true);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // TODO: Trigger song list refresh or redirect
        
      } else {
        const error = await res.json();
        setFileError(error.error || 'Failed to add song');
        console.error('Failed to add song:', error);
      }
    } catch (error) {
      console.error('Error adding song:', error);
      setFileError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background rounded-lg shadow-sm border border-grey p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Add New Song</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          Song added successfully!
        </div>
      )}

      <InputField
        name="Song title"
        type="text"
        value={title}
        onChange={setTitle}
        placeholder="Title"
        label="Song title"
      />
      {titleError && (
        <p className="text-red-500 text-sm -mt-2">Title is required</p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-4 border border-grey rounded-lg">
            <span className="text-2xl">📂</span>
            <span className="text-foreground">
              {musicFile ? musicFile.name : 'Select audio file (max 5MB)'}
            </span>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {fileError && (
          <p className="text-red-500 text-sm">{fileError}</p>
        )}
        
        {musicFile && (
          <p className="text-sm text-gray-600">
            Size: {(musicFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      <Button
        onClick={addSong}
        text={loading ? 'Adding...' : 'Add Song'}
        disabled={loading}
      />
    </div>
  );
};

export default AddSong;
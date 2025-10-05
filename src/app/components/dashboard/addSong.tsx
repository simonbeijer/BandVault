'use client';

import InputField from '@/components/inputField';
import Button from '@/components/button';
import { useState, type ChangeEvent } from 'react';
import Spinner from '../spinner';

const AddSong = () => {
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Valid audio/video formats for music and voice memos
  const VALID_AUDIO_FORMATS = [
    'audio/mpeg',        // .mp3
    'audio/mp3',
    'audio/wav',         // .wav
    'audio/wave',
    'audio/x-wav',
    'audio/aac',         // .aac
    'audio/m4a',         // .m4a
    'audio/x-m4a',
    'audio/mp4',         // .m4a sometimes
    'audio/ogg',         // .ogg
    'audio/flac',        // .flac
    'audio/webm',        // .webm
    'video/mp4',         // Voice memos (m4a/mp4) ⭐
    'video/quicktime',   // .mov files
    'video/x-m4a',
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    setFileError('');
    
    if (!file) {
      return;
    }

    // Check if it's a valid audio/video file
    const isValidFormat = VALID_AUDIO_FORMATS.includes(file.type) ||
                         file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac|webm|mp4|mov)$/i);

    if (!isValidFormat) {
      setFileError(`Invalid file type: ${file.type}. Please select an audio file (MP3, WAV, M4A, AAC, etc.)`);
      return;
    }

    const maxSize = 50 * 1024 * 1024; // Increased to 50MB for longer recordings
    if (file.size > maxSize) {
      setFileError('File too large. Maximum size is 50MB');
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
        placeholder="Enter song title"
        label="Song title"
      />
      {titleError && (
        <p className="text-red-500 text-sm -mt-2">Title is required</p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-4 border border-grey rounded-lg hover:border-primary transition-colors">
            <span className="text-2xl">
              {musicFile ? '🎵' : '📂'}
            </span>
            <div className="flex-1">
              <span className="text-foreground block">
                {musicFile ? musicFile.name : 'Select audio file'}
              </span>
              {!musicFile && (
                <span className="text-sm text-grey">
                  Supports: MP3, WAV, M4A, AAC, Voice Memos (max 50MB)
                </span>
              )}
            </div>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*,video/mp4,video/quicktime,.m4a,.mp3,.wav,.aac,.ogg,.flac"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {fileError && (
          <p className="text-red-500 text-sm">{fileError}</p>
        )}
        
        {musicFile && (
          <div className="text-sm text-grey space-y-1">
            <p>Size: {(musicFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {musicFile.type || 'Unknown'}</p>
          </div>
        )}
      </div>

      <Button
        onClick={addSong}
        text={loading ? 'Uploading...' : 'Add Song'}
        disabled={loading}
      >
        {loading && <Spinner />}
      </Button>
    </div>
  );
};

export default AddSong;
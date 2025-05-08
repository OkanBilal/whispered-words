import React from 'react';
import { Button } from '@/components/ui/button';
import { useStoreTranscriptionFileMutation, useGetTranscriptionDownloadUrlQuery } from '@/lib/transcriptionsApi';
import { Download, FileText } from 'lucide-react';

interface DownloadTranscriptionButtonProps {
  transcriptionId: string;
  content: string;
  format: string;
  hasExistingFile?: boolean;
}

export const DownloadTranscriptionButton: React.FC<DownloadTranscriptionButtonProps> = ({
  transcriptionId,
  content,
  format,
  hasExistingFile = false,
}) => {
  const [storeFile, { isLoading: isStoring }] = useStoreTranscriptionFileMutation();
  
  // Only fetch the download URL if there's already a file stored
  const { data: downloadData, isLoading: isLoadingUrl } = 
    useGetTranscriptionDownloadUrlQuery(transcriptionId, { 
      skip: !hasExistingFile,
    });

  const handleDownload = async () => {
    try {
      // If there's no existing file, store it first
      if (!hasExistingFile) {
        const response = await storeFile({
          id: transcriptionId,
          content,
          format,
        }).unwrap();
        
        // Open the download URL in a new tab
        if (response.download_url) {
          window.open(response.download_url, '_blank');
        }
      } else if (downloadData?.download_url) {
        // If we already have a download URL, use it
        window.open(downloadData.download_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading transcription:', error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      leftIcon={hasExistingFile ? <Download size={16} /> : <FileText size={16} />}
      disabled={isStoring || isLoadingUrl}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
    >
      {isStoring || isLoadingUrl ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {hasExistingFile ? 'Download' : 'Save & Download'}
        </>
      )}
    </Button>
  );
};

export default DownloadTranscriptionButton;

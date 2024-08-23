import { useEffect, useState } from 'react';
import { AutoAwesomeRounded as AutoAwesomeRoundedIcon } from '@mui/icons-material';
import CustomSelect from './CustomSelect';

interface Persona {
  _id: string;
  job: string;
}

interface CommentType {
  _id: string;
  name: string;
}

export default function App() {
  const [personaId, setPersonaId] = useState<string | ''>('');
  const [commentTypeId, setCommentTypeId] = useState<string | ''>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [commentTypes, setCommentTypes] = useState<CommentType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { selectedPersonaId, selectedCommentTypeId } = await chrome.storage.sync.get([
        'selectedPersonaId',
        'selectedCommentTypeId',
      ]);

      setPersonaId(selectedPersonaId || 'select');
      setCommentTypeId(selectedCommentTypeId || 'select');
    };

    loadData();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'commentGenerationDone') {
        setIsGenerating(false);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.onChanged.addListener(changes => {
      if (changes.personas) {
        setPersonas(changes.personas.newValue || []);
      }

      if (changes.commentTypes) {
        setCommentTypes(changes.commentTypes.newValue || []);
      }
    });

    chrome.storage.local.get(['personas', 'commentTypes']).then(({ personas, commentTypes }) => {
      setPersonas(personas || []);
      setCommentTypes(commentTypes || []);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ selectedPersonaId: personaId });
  }, [personaId]);

  useEffect(() => {
    console.log('commentTypeId: ', commentTypeId);
    chrome.storage.sync.set({ selectedCommentTypeId: commentTypeId });
  }, [commentTypeId]);

  const initiateGenerate = () => {
    if (personaId === 'select' || commentTypeId === 'select') {
      alert('Please select persona and comment type');
      return;
    }

    setIsGenerating(true);
    chrome.runtime.sendMessage({ action: 'initiateGenerate' });
  };

  return (
    <div className="w-full my-4 flex gap-1 justify-between items-center">
      <div className="flex gap-2">
        <div className="relative w-[140px]">
          <CustomSelect
            options={personas.map(({ _id, job }) => ({ _id, name: job || _id }))}
            onSelect={option => setPersonaId(option._id)}
            selectedValue={personaId}
          />
        </div>
        <div className="relative w-[140px]">
          <CustomSelect
            options={commentTypes.map(({ _id, name }) => ({ _id, name }))}
            onSelect={option => setCommentTypeId(option._id)}
            selectedValue={commentTypeId}
          />
        </div>
      </div>

      <div className="relative inline-block p-[0.3rem] rounded-full bg-gradient-to-r from-purple-600 to-cyan-500">
        <button
          onClick={initiateGenerate}
          className="text-black px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-100 flex justify-between items-center text-[1.1rem] font-semibold">
          <AutoAwesomeRoundedIcon className="size-[1.5rem]" sx={{ color: 'blue' }} />

          <span className="ms-2">{isGenerating ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>
    </div>
  );
}

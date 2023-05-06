import { useState } from 'react';
import { InputEnum, Tool } from '../screens/Index';
import { PencilSquareIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ToolCardProps {
  tool: Tool;
  onUpdate: (id: string, data: Partial<Tool>) => void;
  onDelete: (id: string) => void;
}

const ToolCard = ({ tool, onUpdate, onDelete }: ToolCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [inputData, setInputData] = useState<Partial<Tool>>(tool);

  const toggleIsEdit = () => setIsEdit((prevState) => !prevState);

  const onClose = () => {
    setIsEdit(false);
    setInputData(tool);
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleUpdate = () => {
    setIsEdit(false);
    onUpdate(tool.id, inputData);
  };

  const handleDelete = () => {
    onDelete(tool.id);
  };

  const inputClasses = clsx('bg-transparent', 'border-0', 'cursor-pointer', 'py-2', 'px-4', 'rounded-md');

  return (
    <div
      key={tool.id}
      className="h-48 flex flex-col group relative justify-between rounded-md shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700"
    >
      <div>
        <input
          className={clsx(inputClasses, 'text-xl bg-transparent mb-2 font-bold', {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit,
          })}
          value={inputData.title}
          onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
        />
        <input
          className={clsx(inputClasses, {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit,
          })}
          value={inputData.description}
          onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
        />
      </div>
      <input
        className={clsx(inputClasses, 'text-xl bg-transparent mb-2 font-bold', 'text-slate-400 bg-transparent', {
          'bg-gray-900': isEdit,
          'cursor-text': isEdit,
        })}
        value={inputData.url}
        onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
      />
      {isEdit ? (
        <>
          <XCircleIcon onClick={onClose} className="absolute top-4 right-12 h-6 w-6 text-red-900 cursor-pointer" />
          <CheckIcon onClick={handleUpdate} className="absolute top-4 right-4 h-6 w-6 text-green-500 cursor-pointer" />
        </>
      ) : (
        <>
          <button
            onClick={toggleIsEdit}
            className="btn btn-active btn-ghost hidden group-hover:block absolute top-4 right-6 p-0"
          >
            <PencilSquareIcon className="h-6 w-6 text-slate-50 cursor-pointer" />
          </button>
          <button className="btn btn-active btn-ghost hidden group-hover:block absolute top-4 right-0 p-0">
            <XCircleIcon onClick={handleDelete} className="h-6 w-6 text-slate-50 cursor-pointer" />
          </button>
        </>
      )}
    </div>
  );
};

export default ToolCard;

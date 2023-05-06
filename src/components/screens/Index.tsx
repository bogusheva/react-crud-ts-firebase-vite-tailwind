import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import ToolCard from '../shared/ToolCard';

import 'react-toastify/dist/ReactToastify.css';

export type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  Url = 'url',
}

function Index() {
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Tool>>({
    title: '',
    description: '',
    url: '',
  });
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      // reference to the firestore database service
      const toolsCollection = collection(firestore, 'tools');
      // variable that make reference to 'tools' collection using function 'query'
      const toolsQuery = query(toolsCollection);
      /* A request is made to the Firestore database using the 'getDocs' function, which retrieves data from the collection that matches the toolsQuery query. */
      const querySnapshot = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      /* A forEach loop is used to iterate over each document in the querySnapshot, and for each document:
          a. A new object is created using the spread operator (...doc.data()) to combine the document data with an id property equal to the document ID.
          b. The new object is cast as a Tool (type definition).
          c. The new Tool is pushed onto the fetchedData array. */
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });
      setTools(fetchedData);
    }
    fetchData();
  }, []);

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const onUpdateTool = (id: string, data: Partial<Tool>) => {
    const docRef = doc(firestore, 'tools', id);
    updateDoc(docRef, data)
      .then((docRef) => {
        toast.success('Updated successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onDeleteTool = (id: string) => {
    const docRef = doc(firestore, 'tools', id);
    setTools(tools.filter((doc) => doc.id !== id));
    deleteDoc(docRef)
      .then((docRef) => {
        toast.success('Deleted successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const toolsCollection = collection(firestore, 'tools');
      const newTool: Partial<Tool> = {
        title: inputData.title,
        description: inputData.description,
        url: inputData.url,
      };
      // save data to firebase
      const docRef = await addDoc(toolsCollection, newTool);
      toast.success('Saved the tool successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      // update state of tools
      setTools([...tools, { id: docRef.id, ...newTool }] as Array<Tool>);
      // clear form
      setInputData({
        title: '',
        description: '',
        url: '',
      });
    } catch (error) {
      console.log(formError);
      setFormError(true);
    }
  };

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
              placeholder="title"
              value={inputData.title}
              className="bg-transparent text-slate-50 border border-slate-700 focus: ring-slate-400 focus: outline-none p-4 m-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
              placeholder="description"
              value={inputData.description}
              className="bg-transparent text-slate-50 border border-slate-700 focus: ring-slate-400 focus: outline-none p-4 m-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
              placeholder="link"
              value={inputData.url}
              className="bg-transparent text-slate-50 border border-slate-700 focus: ring-slate-400 focus: outline-none p-4 m-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 border border-purple-500 p-5 rounded-lg bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50 transition-opacity"
            >
              Add new tool
            </button>
          </form>
          <div className="grid grid-cols-3 gap-4 w-full bg-transparent text-slate-50">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onUpdate={onUpdateTool} onDelete={onDeleteTool} />
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;

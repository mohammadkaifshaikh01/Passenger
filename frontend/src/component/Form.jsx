import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ContextProvider } from '../Context/ContextApi';

const Form = () => {
  const { formData, setFormData } = useContext(ContextProvider);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searcher, setSearcher] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    axios.get('https://passenger-roci.onrender.com/passengerData')
      .then(response => {
        setFormData(response.data);
        setSearcher(response.data); // Initialize search results with full data
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [setFormData]);

  const searchFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = formData.filter((elem) =>
      elem.name.toLowerCase().includes(searchValue)
    );
    setSearcher(filteredData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    const formDataObj = new FormData();
    formDataObj.append('name', name);
    formDataObj.append('age', age);
    formDataObj.append('email', email);
    formDataObj.append('contact', contact);
    formDataObj.append('gender', gender);
    if (image) formDataObj.append('photo', image);
    if (document) formDataObj.append('idcard', document);

    try {
      const response = await axios.post('https://passenger-roci.onrender.com/passengerData', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData([...formData, response.data]);
      setSearcher([...formData, response.data]); // Update search results as well
      setSubmitSuccess(true);
      setName(''); setAge(''); setEmail(''); setContact(''); setGender('');
      setImage(null); setDocument(null);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://passenger-roci.onrender.com/passengerData/${id}`);
      const updatedData = formData.filter(item => item._id !== id);
      setFormData(updatedData);
      setSearcher(updatedData); // Update search results
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-200 w-210">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Personal Information</h2>
      {submitSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">Information submitted successfully!</div>}
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} required className="w-full p-2 border rounded" />
        <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full p-2 border rounded">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required className="w-full p-2 border rounded" />
        <input type="file" onChange={(e) => setDocument(e.target.files[0])} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className="mt-10">
        <input type="text" placeholder="Search..." className="w-full p-2 border rounded mb-2" onChange={searchFilter} />
        <h2 className="text-xl font-bold mb-4">Submitted Data</h2>
        {searcher.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Age</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Contact</th>
                <th className="border px-3 py-2">Gender</th>
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Document</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {searcher.map((data) => (
                <tr key={data._id} className="bg-white">
                  <td className="border px-3 py-2">{data.name}</td>
                  <td className="border px-3 py-2">{data.age}</td>
                  <td className="border px-3 py-2">{data.email}</td>
                  <td className="border px-3 py-2">{data.contact}</td>
                  <td className="border px-3 py-2">{data.gender}</td>
                  <td className="border px-3 py-2">
                    {data.photo && <img src={data.photo} alt="Profile" className="w-10 h-10 object-cover rounded" />}
                  </td>
                  <td className="border px-3 py-2">
                    {data.idcard && <a href={data.idcard} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View PDF</a>}
                  </td>
                  <td className="border px-3 py-2">
                    <button onClick={() => handleDelete(data._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default Form;

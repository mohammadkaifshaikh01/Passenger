import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ContextProvider } from '../Context/ContextApi';

const FormData = () => {
  const { formData, setFormData } = useContext(ContextProvider);
  const [passengers, setPassengers] = useState([{
    name: '',
    age: '',
    email: '',
    contact: '',
    gender: '',
    image: null,
    document: null,
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searcher, setSearcher] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    axios.get('https://passenger-roci.onrender.com/passenger/passengerData')
      .then(response => {
        setFormData(response.data);
        setSearcher(response.data);
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

  const handleAddPassenger = () => {
    setPassengers([...passengers, {
      name: '',
      age: '',
      email: '',
      contact: '',
      gender: '',
      image: null,
      document: null,
    }]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleFileChange = (index, field, file) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = file;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      const newPassengersData = [];
      console.log("passenger" ,passengers)
      // Submit each passenger individually
      for (const passenger of passengers) {
        console.log("pass",passenger)
        
        const formDataToSubmit = new window.FormData();
        formDataToSubmit.append('name', passenger.name);
        formDataToSubmit.append('age', passenger.age);
        formDataToSubmit.append('email', passenger.email);
        formDataToSubmit.append('contact', passenger.contact);
        formDataToSubmit.append('gender', passenger.gender);
        if (passenger.image) formDataToSubmit.append('photo', passenger.image);
        if (passenger.document) formDataToSubmit.append('idcard', passenger.document);
        console.log("submit",formDataToSubmit)
        const response = await axios.post('https://passenger-roci.onrender.com/passenger/passengerData', formDataToSubmit, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        newPassengersData.push(response.data);

      }
      
      // Update state with all the new passengers
      const updatedFormData = [...formData, ...newPassengersData];
      setFormData(updatedFormData);
      setSearcher(updatedFormData);
      console.log(updatedFormData)
      setSubmitSuccess(true);
      
      // Reset form
      setPassengers([{
        name: '',
        age: '',
        email: '',
        contact: '',
        gender: '',
        image: null,
        document: null,
      }]);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://passenger-roci.onrender.com/passenger/passengerData/${id}`);
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
        {passengers.map((passenger, index) => (
          <div key={index} className="border p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Passenger {index + 1}</h3>
              {passengers.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemovePassenger(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Name" 
                value={passenger.name} 
                onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} 
                required 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="number" 
                placeholder="Age" 
                value={passenger.age} 
                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)} 
                required 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={passenger.email} 
                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)} 
                required 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="text" 
                placeholder="Contact" 
                value={passenger.contact} 
                onChange={(e) => handlePassengerChange(index, 'contact', e.target.value)} 
                required 
                className="w-full p-2 border rounded" 
              />
              <select 
                value={passenger.gender} 
                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)} 
                required 
                className="w-full p-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Photo:</label>
                <input 
                  type="file" 
                  onChange={(e) => handleFileChange(index, 'image', e.target.files[0])} 
                  required 
                  className="w-full p-2 border rounded" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ID Document:</label>
                <input 
                  type="file" 
                  onChange={(e) => handleFileChange(index, 'document', e.target.files[0])} 
                  required 
                  className="w-full p-2 border rounded" 
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={handleAddPassenger}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex-1"
          >
            Add Passenger
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex-1" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit All'}
          </button>
        </div>
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

export default FormData;
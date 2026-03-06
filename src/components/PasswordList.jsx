"use client";
import { useState } from "react";

const PasswordList = ({ data, loading, uid }) => { 
  const [visibleStates, setVisibleStates] = useState(
    Array.isArray(data) ? new Array(data.length).fill(false) : []
  );

  
  async function deleteEntry(index) {
    if (!data || !data[index]) return;
    
    const item = data[index];
    

    if (!confirm(`Delete password for ${item.website}?`)) {
      return;
    }
    
    try {
      
      const response = await fetch("/api/deleteEntry", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          website: item.website,
          username: item.username,
          uid: uid
        })
      });


      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete");
      }

      window.location.reload();
      


      alert("Entry deleted successfully!");

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete: " + error.message);
    }
  }

  function togglePassword(index) {
    const newVisibleStates = [...visibleStates];
    newVisibleStates[index] = !newVisibleStates[index];
    setVisibleStates(newVisibleStates);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400 text-lg">Loading passwords...</div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No passwords saved yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div 
          key={index} 
          className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 hover:border-zinc-600 transition-all"
        >
          <div className="space-y-3">
            {/* Website */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 font-medium w-20">Website:</span>
              <input 
                type="text" 
                value={item.website} 
                readOnly 
                className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none"
              />
            </div>
            
            {/* Username */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 font-medium w-20">Username:</span>
              <input 
                type="text" 
                value={item.username} 
                readOnly 
                className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none"
              />
            </div>
            
            {/* Password */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 font-medium w-20">Password:</span>
              <div className="flex-1 flex items-center gap-2">
                <input 
                  type={visibleStates[index] ? "text" : "password"} 
                  value={item.password} 
                  readOnly 
                  className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none"
                /> 
                <button
                  onClick={() => togglePassword(index)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <i className={visibleStates[index] ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
                <button 
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" 
                  onClick={() => deleteEntry(index)}
                > 
                  <i className="fa-solid fa-trash"></i> 
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordList;
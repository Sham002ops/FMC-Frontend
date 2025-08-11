import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
const BackendUrl = import.meta.env.VITE_API_URL


const AllUsers = () => {
    const [loading, setLoading]= useState(false);
    const [allUsers, setAllUsers]= useState<any[]>([]);

   useEffect(()=>{
    const fetchAllusers = async()=>{
         try{
            setLoading(true)
        const response = axios.get(`${BackendUrl}/admin/getallusers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        console.log(" all users: ", (await response).data.AllUsers);
        setAllUsers((await response).data.AllUsers)
        
    } catch (err) {
    console.log(" error : ", err);
    
  } finally{
    setLoading(false);
  }
    }

    fetchAllusers()
   },[])
if(loading){
    return(
      <div className=' flex items-center justify-center pt-80'>
        <Processing/>
      </div>  
    )
}
   
  return (
        <div>
            <div>
                <Sidebar/>
            </div>
            <div>
                <h1 className='text-3xl font-bold pl-28 p-8'>All Users</h1> 
            </div>
            
            <div className='flex justify-center items-center p-8 pl-28'>
                
            {allUsers.length === 0 ? (
            <p>No users found</p>
            ) : (
            <table className="border-collapse border border-gray-300 w-full">
                <thead>
                <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Coins</th>
                    <th className="border p-2">packageId</th>
                    <th className="border p-2">executiveRefode</th>
                    <th className="border p-2">Role</th>
                </tr>
                </thead>
                <tbody>
                {allUsers.map((user) => (
                    <tr key={user.id}>
                    <td className="border flex justify-center items-center p-1">{user.name}</td>
                    <td className="border pl-24  p-1">{user.email}</td>
                    <td className="border flex justify-center items-center p-1">{user.coins}</td>
                    <td className="border pl-10 p-1">{user.packageId}</td>
                    <td className="border pl-10 p-1">{user.executiveRefode}</td>
                    <td className="border pl-10 p-1">{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </div>
        );

}

export default AllUsers
import React from 'react';
import '../../App.css';
import { ConnectContext } from '../../context/ConnectContext';
import {useState, useContext, useEffect} from 'react'
import CardItem from '../CardItem';
import SearchIcon from '@material-ui/icons/Search';
import file from '../../asset/sd.jpg'

export default function Services() {
const {currentAccount, fetchClosedCases}= useContext(ConnectContext)

const [query, setQuery] = useState("")
const [data, setData] = useState([])

const fetch = async() =>{
  const tx = await fetchClosedCases()
       setData(tx)

}

useEffect(() => {fetch()
  }, [data])


  return(
    <>
    { currentAccount ? (
    <div >
      <div className="header__searchContainer">
                <div className="header__searchBar">
                    <SearchIcon />
                    <input type="text" placeholder='Search Files' onChange={event => setQuery(event.target.value)}/>
                 
                </div>
            </div>
     
      
      {data?.filter(post => {
        if (query === ""){
          return post
        }else if (post.caseId.toLowerCase().includes(query.toLowerCase())){
          return post
        }
      }).map((post, index)=>(
        <CardItem
        key ={index}
        src={file}
        text={post.caseId}
        label='Mystery'
        path={`https://ipfs.infura.io/ipfs/${post.fileHash}`}
      />
      ))
        
      }
      
    </div>) : (
      <div>
        <h1>PLEASE CONNECT WALLET TO VIEW RECORD</h1>
      </div>
    )}
    </>
  ) ;
}

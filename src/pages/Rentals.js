import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import logo from "../images/airbnbRed.png";
import { ConnectButton, Icon, Button } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";


const Rentals = () => {
  const {state: searchFilters} = useLocation();
  const [highLight, setHighLight] = useState();
  const {Moralis} = useMoralis();
  const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState([]);

  useEffect(() => {

    async function fetchRentalsList() {
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);

      const result = await query.find();

      let cords = [];
      result.forEach((e) => {
        cords.push({ lat: e.attributes.lat, lng: e.attributes.long })
      });

      setCoOrdinates(cords);
      setRentalsList(result);

    }

  }, [searchFilters])

  return (
    <>
     <div className="topBanner">
       <div>
         <Link to='/'>
           <img className="logo" src={logo} alt='logo'></img>
         </Link>
       </div>
       <div className="searchReminder">
         <div className="filter">
           {searchFilters.destination}
         </div>
         <div className='vl'></div>
         <div className="filter">
         {`
          ${searchFilters.checkIn.toLocaleString("default", {month: "short"})}
          ${searchFilters.checkIn.toLocaleString("default", {day: "2-digit"})}
          -
          ${searchFilters.checkOut.toLocaleString("default", {month: "short"})}
          ${searchFilters.checkOut.toLocaleString("default", {day: "2-digit"})}
         `}
         </div>
         <div className='vl'></div>
         <div className="filter">
         {searchFilters.guests} Guest
         </div>
         <div className="searchFiltersIcon">
           <Icon fill="#ffffff" size={20} svg="search" />
         </div>
       </div>
       <div className='lrContainers'>
        <ConnectButton />
       </div>
     </div>
     <hr className="line" />
     <div className="rentalsContent">
       <div className="rentalsContentL">
         Stays available for your destination
         {rentalsList &&
         rentalsList.map((e, i) => {
           return(
             <>
              <hr className="line2" />
              <div className={highLight == i ? "rentalDivH" : "rentalDiv"}>
                <img className="rentalImg" src={e.attributes.imgUrl} alt='rentalImg'></img>
                <div className="rentalInfo">
                  <div className="rentalTitle">{e.attributes.name}</div>
                  <div className="rentalDesc">{e.attributes.unoDescription}</div>
                  <div className="rentalDesc">{e.attributes.dosDescription}</div>
                  <div className="bottomButton">
                    <Button 
                    text="Stay Here"
                    />
                    <div className="price">
                      <Icon fill="#808080" size={10} svg="matic" /> {e.attributes.pricePerDay} / Day
                    </div>
                  </div>
                </div>
              </div>
             </>
           )
         })
         }
       </div>
       <div className="rentalsContentR">
         <RentalsMap locations={coOrdinates} setHighLight={setHighLight}/>
       </div>
     </div>
    </>
  );
};

export default Rentals;

'use client';

import React, { useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
import { useJsApiLoader, GoogleMap, Autocomplete } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const defaultCenter = { lat: 13.7367858, lng: 100.5331428};

interface Step2Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
}

const libraries = ['places'] as ['places'];

const Step2: React.FC<Step2Props> = ({ setActivePage }) => {
  const [locationData, setLocationData] = useState<LocationData>({
    address: "254 Phaya Thai Rd, Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330, Thailand",
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    place_id: "ChIJc4NRsNWe4jARQ6LvlRhjCb8"
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  
  // ใช้ autocompleteRef แทน searchRef เพื่อเก็บ reference ของ Autocomplete object
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });
  
  // Initialize marker when map is loaded and ready
  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
    
    // Create a marker at the default position
    const newMarker = new google.maps.Marker({
      position: { lat: locationData.latitude, lng: locationData.longitude },
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    
    setMarker(newMarker);
    
    // Add listener for marker drag end event
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        const newLat = position.lat();
        const newLng = position.lng();
        
        // Update location data state
        setLocationData(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLng
        }));
        
        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            setLocationData(prev => ({
              ...prev,
              address: results[0].formatted_address,
              place_id: results[0].place_id
            }));
            
            // อัพเดต input field ด้วย
            if (searchInputRef.current) {
              searchInputRef.current.value = results[0].formatted_address;
            }
          }
        });
      }
    });
  };
  
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        // Update map center and marker position
        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(17);
        }
        
        if (marker) {
          marker.setPosition({ lat, lng });
        }
        
        // Update location data with all information synchronized
        setLocationData({
          address: place.formatted_address || '',
          latitude: lat,
          longitude: lng,
          place_id: place.place_id || ''
        });
      }
    }
  };
  // const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would save the location data
    console.log('Saving location data:', locationData);
    // Navigate to next step
    // setActivePage('finance');
    // router.push('/dashboard');
    setActivePage('booking');
    
  };
  
  const handleBack = () => {
    setActivePage('overview');
  };
  
  // Loading state display
  if (loadError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow p-6 text-center">
          <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดแผนที่ กรุณาลองใหม่อีกครั้ง</p>
          <p className="text-gray-500 mt-2">Error: {loadError.message}</p>
        </div>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow p-6 text-center">
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }
  
  return (
    <section className='relative min-h-screen overflow-hidden px-4'>
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">
        {/* สำหรับหน้าจอมือถือ (Mobile) - ย้ายส่วนสีน้ำเงินขึ้นด้านบน */}
        <div className="md:hidden bg-blue-600 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-xl font-bold text-white mb-2">เลือกตำแหน่งที่ตั้ง</h1>
          <p className="text-blue-100 mb-3 text-sm">ระบุตำแหน่งที่ตั้งโรงแรมของคุณ</p>
          <div className="mb-2">
            <FaMapMarkerAlt className="h-12 w-12 text-white opacity-80" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ตำแหน่งที่ตั้งโรงแรม</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="place-search" className="block text-sm font-medium text-gray-700">ค้นหาตำแหน่ง</label>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    // เก็บ autocomplete object ไว้ใน ref
                    autocompleteRef.current = autocomplete;
                    // Add listener for place_changed event
                    autocomplete.addListener('place_changed', handlePlaceSelect);
                  }}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    id="place-search"
                    placeholder="ค้นหาชื่อสถานที่"
                    className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Autocomplete>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                <input
                  type="text"
                  id="address"
                  value={locationData.address}
                  readOnly
                  className="w-full px-3 py-2 text-sm font-bold text-blue-500 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">แผนที่</label>
                <div className="w-full h-64 rounded-md border border-gray-300 overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: locationData.latitude, lng: locationData.longitude }}
                    zoom={15}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                    onLoad={onMapLoad}
                  >
                    {/* Marker will be added via onMapLoad */}
                  </GoogleMap>
                </div>
                <p className="mt-2 text-xs text-gray-500">ลากหมุดเพื่อปรับตำแหน่งที่ตั้งให้ถูกต้อง</p>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  <span>ย้อนกลับ</span>
                </button>
                
                <button
                  type="submit"
                  className="flex items-center text-sm space-x-1 px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition duration-200"
                >
                  <span>ถัดไป</span>
                  <FaArrowRight className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
          
          {/* สำหรับหน้าจอ desktop - แสดงส่วนสีน้ำเงินด้านขวา */}
          <div className="hidden md:flex md:w-1/3 bg-blue-600 flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">เลือกตำแหน่งที่ตั้ง</h1>
            <p className="text-blue-100 mb-6">ระบุตำแหน่งที่ตั้งโรงแรมของคุณ</p>
            <div className="mt-4">
              <FaMapMarkerAlt className="h-16 w-16 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Step2;
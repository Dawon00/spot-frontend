
import React, { useState } from 'react';
import TmapComponent from '../components/TmapComponent';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const MapPage = () => {


    return (
        <div className='min-h-screen'>
            <TmapComponent />
        </div>

    );
};

export default MapPage;

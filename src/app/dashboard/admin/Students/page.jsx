'use client'
import React, { useEffect, useState } from 'react';
import StudentTable from './StudentTable';
import axios from 'axios';

const page = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchStudents = () => {
        setIsLoading(true);
        axios.get(`/api/students`)
            .then((res) => setStudents(res.data.data))
            .finally(() => {
                setIsLoading(false)
                setIsUpdating(false)
            });
    }

    useEffect(() => {
        fetchStudents();
    }, [])

    const refetchStudents = async () => {
        await fetchStudents();
    };

    const updateStat = async (id, newStat) => {
        // console.log('stat id: ', id);
        // console.log('newStat: ', newStat);
        setIsUpdating(true);
        axios.patch(`/api/students?id=${id}`, {
            stat: newStat
        })
            .then((res) => {
                console.log(res);
                refetchStudents();
            })
            // .finally(() => setIsUpdating(false))

    }

    return (
        <div>
            This is participant page
            <StudentTable
                students={students}
                isLoading={isLoading}
                isUpdating={isUpdating}
                onUpdateStatus={updateStat}
            ></StudentTable>
        </div>
    );
};

export default page;

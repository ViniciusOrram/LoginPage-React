import React, {useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FiPower, FiEdit, FiTrash2 } from 'react-icons/fi'
import './styles.css';

import api from '../../services/api';

import logoImage from '../../assets/logo.svg'

export default function Books(){

    const [books, setBooks] = useState([]);

    const userName = localStorage.getItem('userName');

    const accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    useEffect(() => {
        api.get('api/Book/v1/asc/20/1',{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                setBooks(response.data.list)
            });
    }, [accessToken]);

    async function logout(){
        try {
            await api.get('api/auth/v1/revoke', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            localStorage.clear();
            navigate('/');
        } catch (err) {
            alert('Logout failed');
        }
    }

    async function deleteBook(id){
        try {
            await api.delete(`api/Book/v1/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBooks(books.filter(book => book.id !== id))
        } catch (err) {
            alert('Delete failed');
        }
    }

    async function editBook(id){
        try {
            navigate(`new/${id}`);
        } catch (err) {
            alert('Edit failed');
        }
    }

    return (
        <div className="book-container">
            <header>
                <img src={logoImage} alt="E"/>
                <span>Welcome, <strong>{userName}</strong></span>
                <Link className="button" to="new/0">Add New Book</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color="#251FC5"/>
                </button>
            </header>

            <h1>Register Books</h1>
            <ul>
                {books.map(book => {
                    <li key ={book.id}>
                        <strong>Title:</strong>
                        <p>{book.title}</p>
                        <strong>Author:</strong>
                        <p>{book.author}</p>
                        <strong>Price</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                        <strong>Release Date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>
                
                        <button onClick={() => editBook(book.id)}type="button">
                            <FiEdit size={20} color="251FC5"/>
                        </button>
                
                        <button onClick={() => deleteBook(book.id)} type="button">
                            <FiTrash2 size={20} color="251FC5"/>
                        </button>
                    </li>
                })}
            </ul>
        </div>
    );
}
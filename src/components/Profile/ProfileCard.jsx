import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const ProfileCard = ({ student }) => {

    const { id, name, email, studentId, department, status, batch, image } = student;

    console.log('email:', email);
    console.log('name:', name);
    console.log('batch:', batch);
    console.log('department:', department);

    return (
        <StyledWrapper>
            <div className="profile-card">
                <div className="profile-image">
                    {image ?
                        <Image
                            src={image}
                            alt='User Image'
                            width={70}
                            height={70}
                        />
                        :
                        <svg fill="#000000" xmlSpace="preserve" viewBox="0 0 64 64" height="70px" width="70px" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Layer_1" version={1.0}>
                            <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                            <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                            <g id="SVGRepo_iconCarrier">
                                <g>
                                    <path d="M18,12c0-5.522,4.478-10,10-10h8c5.522,0,10,4.478,10,10v7c0-3.313-2.687-6-6-6h-6c-2.209,0-4-1.791-4-4 c0-0.553-0.447-1-1-1s-1,0.447-1,1c0,2.209-1.791,4-4,4c-3.313,0-6,2.687-6,6V12z" fill="#506C7F" />
                                    <path d="M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2v-8c0-1.104,0.447-2.104,1.172-2.828l-0.004-0.004 c4.148-3.343,8.896-5.964,14.046-7.714C20.869,45.467,26.117,48,31.973,48c5.862,0,11.115-2.538,14.771-6.56 c5.167,1.75,9.929,4.376,14.089,7.728l-0.004,0.004C61.553,49.896,62,50.896,62,52V60z" fill="#7d988a" />
                                    <g>
                                        <path d="M32,42c-2.853,0-5.502-0.857-7.715-2.322c-1.675,0.283-3.325,0.638-4.934,1.097 C22.602,43.989,27.041,46,31.973,46c4.938,0,9.383-2.017,12.634-5.238c-1.595-0.454-3.231-0.803-4.892-1.084 C37.502,41.143,34.853,42,32,42z" fill="#F9EBB2" />
                                        <path d="M46,22h-1c-0.553,0-1-0.447-1-1v-1v-1c0-2.209-1.791-4-4-4h-6c-2.088,0-3.926-1.068-5-2.687 C27.926,13.932,26.088,15,24,15c-2.209,0-4,1.791-4,4v1v1c0,0.553-0.447,1-1,1h-1c-0.553,0-1,0.447-1,1v2c0,0.553,0.447,1,1,1h1 c0.553,0,1,0.447,1,1v1c0,6.627,5.373,12,12,12s12-5.373,12-12v-1c0-0.553,0.447-1,1-1h1c0.553,0,1-0.447,1-1v-2 C47,22.447,46.553,22,46,22z" fill="#F9EBB2" />
                                    </g>
                                    <path d="M62.242,47.758l0.014-0.014c-5.847-4.753-12.84-8.137-20.491-9.722C44.374,35.479,46,31.932,46,28 c1.657,0,3-1.343,3-3v-2c0-0.886-0.391-1.673-1-2.222V12c0-6.627-5.373-12-12-12h-8c-6.627,0-12,5.373-12,12v8.778 c-0.609,0.549-1,1.336-1,2.222v2c0,1.657,1.343,3,3,3c0,3.932,1.626,7.479,4.236,10.022c-7.652,1.586-14.646,4.969-20.492,9.722 l0.014,0.014C0.672,48.844,0,50.344,0,52v8c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4v-8C64,50.344,63.328,48.844,62.242,47.758z M18,12c0-5.522,4.478-10,10-10h8c5.522,0,10,4.478,10,10v7c0-3.313-2.687-6-6-6h-6c-2.209,0-4-1.791-4-4c0-0.553-0.447-1-1-1 s-1,0.447-1,1c0,2.209-1.791,4-4,4c-3.313,0-6,2.687-6,6V12z M20,28v-1c0-0.553-0.447-1-1-1h-1c-0.553,0-1-0.447-1-1v-2 c0-0.553,0.447-1,1-1h1c0.553,0,1-0.447,1-1v-2c0-2.209,1.791-4,4-4c2.088,0,3.926-1.068,5-2.687C30.074,13.932,31.912,15,34,15h6 c2.209,0,4,1.791,4,4v2c0,0.553,0.447,1,1,1h1c0.553,0,1,0.447,1,1v2c0,0.553-0.447,1-1,1h-1c-0.553,0-1,0.447-1,1v1 c0,6.627-5.373,12-12,12S20,34.627,20,28z M24.285,39.678C26.498,41.143,29.147,42,32,42s5.502-0.857,7.715-2.322 c1.66,0.281,3.297,0.63,4.892,1.084C41.355,43.983,36.911,46,31.973,46c-4.932,0-9.371-2.011-12.621-5.226 C20.96,40.315,22.61,39.961,24.285,39.678z M62,60c0,1.104-0.896,2-2,2H4c-1.104,0-2-0.896-2-2v-8c0-1.104,0.447-2.104,1.172-2.828 l-0.004-0.004c4.148-3.343,8.896-5.964,14.046-7.714C20.869,45.467,26.117,48,31.973,48c5.862,0,11.115-2.538,14.771-6.56 c5.167,1.75,9.929,4.376,14.089,7.728l-0.004,0.004C61.553,49.896,62,50.896,62,52V60z" fill="#242424" />
                                    <path d="M24.537,21.862c0.475,0.255,1.073,0.068,1.345-0.396C25.91,21.419,26.18,21,26.998,21 c0.808,0,1.096,0.436,1.111,0.458C28.287,21.803,28.637,22,28.999,22c0.154,0,0.311-0.035,0.457-0.111 c0.491-0.253,0.684-0.856,0.431-1.347C29.592,19.969,28.651,19,26.998,19c-1.691,0-2.618,0.983-2.9,1.564 C23.864,21.047,24.063,21.609,24.537,21.862z" fill="#242424" />
                                    <path d="M34.539,21.862c0.475,0.255,1.073,0.068,1.345-0.396C35.912,21.419,36.182,21,37,21 c0.808,0,1.096,0.436,1.111,0.458C38.289,21.803,38.639,22,39.001,22c0.154,0,0.311-0.035,0.457-0.111 c0.491-0.253,0.684-0.856,0.431-1.347C39.594,19.969,38.653,19,37,19c-1.691,0-2.618,0.983-2.9,1.564 C33.866,21.047,34.065,21.609,34.539,21.862z" fill="#242424" />
                                </g>
                            </g>
                        </svg>
                    }
                </div>
                <div className="profile-info">
                    <p className="profile-name">{name}</p>
                    <p className="profile-name">{studentId}</p>
                    <div className="profile-title">{department} {batch}th</div>
                    <div className="profile-bio text-wrap">{email}</div>
                    {status == 'active' ? <p className='text-green-500 font-semibold'>Active</p> : <p className='text-red-600 font-semibold'>Banned.</p>}
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .profile-card {
  /* keep the look you already have */
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(48px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 12px 12px 12px -20px rgba(0, 0, 0, 0.3);

  /* NEW: make it half-page tall & wide, centre it vertically */
  width: min(420px, 45vw);      /* never wider than 45 % of viewport */
  min-height: 20vh;             /* 70 % of viewport height */
  margin: auto;                 /* centres horizontally */
  display: flex;                /* flex column so children stretch */
  flex-direction: column;
  justify-content: space-between; /* pushes stats to bottom */
}

  .profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #f0f2f5;
    margin: 0 auto 1rem;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .profile-image::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 96px;
    background-color: #e05d38;
    border-radius: 20px 20px 0 0;
    z-index: -1;
  }

  .profile-info {
    text-align: left;
    margin-bottom: 1.5rem;
    text-wrap: wrap;
  }

  .profile-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }

  .profile-title {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .profile-bio {
    font-size: 0.85rem;
    color: #777;
    line-height: 1.4;
    margin-bottom: 1.5rem;
    overflow-wrap: break-word; 
    word-break: break-word;      
  }

  .social-links {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .social-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #f0f2f5;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .social-btn:hover {
    background: #e4e6e9;
    transform: translateY(-6px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  .social-btn svg {
    width: 20px;
    height: 20px;
    fill: #1a1a1a;
    transition: all 0.2s ease;
  }

  .social-btn:hover svg {
    fill: #0066ff;
  }

  /* Specific colors for each social platform */
  .social-btn.twitter:hover svg {
    fill: #1da1f2;
  }
  .social-btn.instagram:hover svg {
    fill: #e4405f;
  }
  .social-btn.linkedin:hover svg {
    fill: #0a66c2;
  }
  .social-btn.github:hover svg {
    fill: #333333;
  }

  .cta-button {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 10px;
    background: #7d988a;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.2s,
      background 0.2s;
  }

  .cta-button:hover {
    background: #4d5d54;
    transform: translateY(-2px);
  }

  .stats {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-weight: 600;
    color: #1a1a1a;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #666;
  }`;

export default ProfileCard;
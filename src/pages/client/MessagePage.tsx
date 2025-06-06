// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Search } from 'lucide-react';
// import useMessageStore from '../../store/messageStore';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { Conversation } from '../../types';

// const MessagesPage: React.FC = () => {
//   const { conversations, loading, error, fetchConversations } = useMessageStore();
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations]);

//   const fi
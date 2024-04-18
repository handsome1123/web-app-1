-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2024 at 11:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_pro`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `phone` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','staff','lecturer') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `firstname`, `lastname`, `phone`, `email`, `password`, `role`) VALUES
(11, 'Thuta', 'Zaw', 927785122, 'ttz2020.mdy@gmail.com', '$2b$10$iCRW9aPKZ.ZdADuYkJr5N.SjOk/FXSuvfZS2mMw1gL2DQu2XTOdWq', 'user'),
(12, 'ADMIN', '-', 945653525, 'admin@gmail.com', '$2b$10$pBqQnu7qbthPDf77vN4XPeQJkD9Ijv3ZYvbZSXQ5Dvv/ASxFOk6E6', 'staff'),
(13, 'Lecturer', '1', 912356521, 'lecturer1@gmail.com', '$2b$10$nvnv5ecoat6pXfSfRmfsEuSoXHr6ndMbN0J/TUW2gG7nwyxupREvG', 'lecturer'),
(14, 'Lecturer', '2', 955846531, 'lecturer2@gmail.com', '$2b$10$H4L3x79wrtF5un.1E07URO294NjRUxv5.NYu0BMAtWwNIKyy.yE.K', 'lecturer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

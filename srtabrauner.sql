-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02-Jul-2020 às 05:31
-- Versão do servidor: 10.4.10-MariaDB
-- versão do PHP: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `srtabrauner`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidos`
--

CREATE TABLE `pedidos` (
  `ped_id` int(11) NOT NULL,
  `rev_id` int(11) NOT NULL,
  `pedpro_id` int(11) NOT NULL,
  `valor` float(14,2) NOT NULL,
  `ped_criado_em` date NOT NULL,
  `ped_atualizado_em` date NOT NULL,
  `ped_deletado_em` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE `produtos` (
  `pro_id` int(11) NOT NULL,
  `pro_nome` varchar(100) NOT NULL,
  `pro_criado_em` date NOT NULL,
  `pro_atualizado_em` date NOT NULL,
  `pro_deletado_em` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos_pedido`
--

CREATE TABLE `produtos_pedido` (
  `proped_id` int(11) NOT NULL,
  `prorev_id` int(11) NOT NULL,
  `proped_estampa` varchar(255) NOT NULL,
  `proped_qtde` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos_revendedores`
--

CREATE TABLE `produtos_revendedores` (
  `prorev_id` int(11) NOT NULL,
  `pro_id` int(11) NOT NULL,
  `rev_id` int(11) NOT NULL,
  `prorev_valor` float(14,2) NOT NULL,
  `prorev_criado_em` date NOT NULL,
  `prorev_atualizado_em` date NOT NULL,
  `prorev_deletado_em` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `revendedores`
--

CREATE TABLE `revendedores` (
  `rev_id` int(11) NOT NULL,
  `rev_nome` varchar(100) NOT NULL,
  `rev_criado_em` date NOT NULL,
  `rev_atualizado_em` date NOT NULL,
  `rev_deletado_em` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`ped_id`);

--
-- Índices para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`pro_id`);

--
-- Índices para tabela `produtos_pedido`
--
ALTER TABLE `produtos_pedido`
  ADD PRIMARY KEY (`proped_id`);

--
-- Índices para tabela `produtos_revendedores`
--
ALTER TABLE `produtos_revendedores`
  ADD PRIMARY KEY (`prorev_id`);

--
-- Índices para tabela `revendedores`
--
ALTER TABLE `revendedores`
  ADD PRIMARY KEY (`rev_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `ped_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `pro_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produtos_pedido`
--
ALTER TABLE `produtos_pedido`
  MODIFY `proped_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produtos_revendedores`
--
ALTER TABLE `produtos_revendedores`
  MODIFY `prorev_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `revendedores`
--
ALTER TABLE `revendedores`
  MODIFY `rev_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

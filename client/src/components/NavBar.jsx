import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { breakpoints, PRI_COLOR, } from "../utils/constants";
import { getTotalWaves } from "../utils/wave.actions";
import { getContract } from "../utils/contractUtils";
import { EmptyContentText } from ".";

const Navbar = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 0.3rem;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const LogoContainer = styled.div`
`;

const MenuContainer = styled.div`
  height: 100%;
  padding-right: 3rem;

  @media screen and ${breakpoints.sm} {
    width: 25%;
    padding-right: 1rem;
  }
`;

const BTN = styled.button`
  align-items: center;
  align-self: center;
  border-radius: 10px 10px 0 0;
  color: #000;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 300;
  height: 100%;
  margin: 2px 6px 2px 12px;
  outline: 0;
  padding: 0 0.7em;
  user-select: none;
  text-decoration: none;
  background-color: ${PRI_COLOR};
  color: #fff;


  @media screen and (min-width: 756px) {
    display: inline-flex;
  }
`

const NavBar = ({ connectWallet, currentAccount }) => {
  const [totalWaves, setTotalWaves] = useState("0");

  const waveCount = async () => {
    try {
      const waves = await getTotalWaves();
      setTotalWaves(waves);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    waveCount()
  }, [currentAccount]);

  const listenerCallback = useCallback(
    async () => {
      console.log(totalWaves)
      const onNewWaveSubmitted = () => {
        setTotalWaves(prev => parseInt(prev) + 1);
      }
      const wavesContract = await getContract();
      wavesContract.on("WaveSubmitted", onNewWaveSubmitted);

      return () => {
        wavesContract.off("WaveSubmitted", onNewWaveSubmitted);
      }
    },
    // eslint-disable-next-line
    [],
  )


  useEffect(() => {
    listenerCallback()
    // eslint-disable-next-line
  }, []);

  return (
    <Navbar>
      <LogoContainer>
        <EmptyContentText style={{ fontSize: '1rem' }}>Ice & Fire</EmptyContentText>
      </LogoContainer>
      <MenuContainer>
        {
          !currentAccount ? (
            <BTN onClick={connectWallet}>
              Connect Wallet
            </BTN>
          ) : <BTN onClick={() => waveCount()} >
            Welcome
          </BTN>
        }
      </MenuContainer>
    </Navbar>
  );
};

export default NavBar;
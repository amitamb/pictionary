import dynamic from 'next/dynamic';

const importKonvaNamed = function(names){
  const retVal = {};
  names.forEach((name) => {
    retVal[name] = dynamic(
      () => import('react-konva').then((mod) => mod[name]),
      { ssr: false }
    )
  });
  return retVal;
};

export default importKonvaNamed;
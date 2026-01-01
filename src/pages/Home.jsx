import Section1 from '../components/Home/Section1';
import Section2 from '../components/Home/Section2';

const Home = () => {
  return (
    <>
      <Section1/>
      <div className='bg-black'>
        <Section2/>
      </div>
    </>
  )
}

export default Home
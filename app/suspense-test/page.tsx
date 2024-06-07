import { Suspense } from 'react';
import PhotoInfoTest from './photoInfoTest';
import PhotospotUploadTest from './photospotUploadTest';


export default function WeatherPage() {
  return (
    <>
      <h1>Test Suspense</h1>
      <Suspense fallback={<Loading />}>
        <PhotoInfoTest />
        <PhotospotUploadTest />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

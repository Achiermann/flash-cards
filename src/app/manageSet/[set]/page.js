"use client";

import { useParams } from "next/navigation";
import { useSetsStore } from "@/app/stores/useSetsStore";
import Link from "next/link";
import AddWordForm from "@/components/addWordForm";
import Wordlist from '@/components/wordlist';
import '@/styles/manageSet.css';

export default function ManageSetView() {


  {/*//.1      VARIABLES            */}

  const { set: slug } = useParams();
  const set = useSetsStore((state) => state.sets.find((s) => s.slug === slug));

  const matchedSet = useSetsStore((state) =>
    state.sets.find((s) => s.slug === slug)
  );


  {/*//.1      HTML            */}


  if (!matchedSet) return <div className="p-4">Loading or Set not found</div>;

  return (
    <div className="manage-set-content">

{/*//.2        HEADER                             */}

  <div className='manage-set-content-header'>
  <div className='manage-set-title'><h2>Manage Set: <br></br>{matchedSet.name}</h2></div>
  <Link href={`/learnView/${set.slug}`}> <button className="button-learn"> Learn</button> </Link>
  <AddWordForm setId={set.id} className = "add-word-form-manage-page"/> </div>
<Wordlist matchedSet={matchedSet}/>
   </div>
  );
}






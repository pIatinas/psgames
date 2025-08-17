import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import MemberCard from '@/components/MemberCard';
import { User } from '@/types';

interface MemberSliderProps {
  members: User[];
  accounts: any[];
}

const MemberSlider: React.FC<MemberSliderProps> = ({ members, accounts }) => {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {members.map((member, index) => {
            const activeAccountsCount = accounts.filter(account => account.slots?.some(slot => slot.user_id === member.id)).length;
            return (
              <CarouselItem key={member.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/6">
                <MemberCard member={member} activeAccountsCount={activeAccountsCount} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default MemberSlider;
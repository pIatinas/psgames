import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { fetchMemberTrophyStats } from '@/services/gameInfoService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
interface MemberTrophyStatsProps {
  psnId: string;
}
const MemberTrophyStats: React.FC<MemberTrophyStatsProps> = ({
  psnId
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchMemberTrophyStats(psnId);
        setStats(data);
      } catch (error) {
        console.error("Error fetching trophy stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [psnId]);
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-800/50 rounded-lg p-4 text-center">
                <Skeleton className="h-6 w-6 mx-auto mb-2 rounded-full" />
                <Skeleton className="h-4 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>)}
          </div>
        </CardContent>
      </Card>;
  }
  if (!stats) {
    return null;
  }
  return <Card>
      <CardHeader>
        <CardTitle>
          Troféus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-yellow-400 mb-2">
              <Trophy className="h-6 w-6 mx-auto" />
            </div>
            <div className="text-xl font-bold text-white">{stats.platinum}</div>
            <div className="text-xs text-gray-300">Platina</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-yellow-300 mb-2">
              <Trophy className="h-6 w-6 mx-auto" />
            </div>
            <div className="text-xl font-bold text-white">{stats.gold}</div>
            <div className="text-xs text-gray-300">Ouro</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-gray-300 mb-2">
              <Trophy className="h-6 w-6 mx-auto" />
            </div>
            <div className="text-xl font-bold text-white">{stats.silver}</div>
            <div className="text-xs text-gray-300">Prata</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-amber-700 mb-2">
              <Trophy className="h-6 w-6 mx-auto" />
            </div>
            <div className="text-xl font-bold text-white">{stats.bronze}</div>
            <div className="text-xs text-gray-300">Bronze</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-primary mb-2">
              <Trophy className="h-6 w-6 mx-auto" />
            </div>
            <div className="text-xl font-bold text-white">{stats.totalTrophies}</div>
            <div className="text-xs text-gray-300">Total</div>
          </div>
        </div>
        
        
      </CardContent>
    </Card>;
};
export default MemberTrophyStats;
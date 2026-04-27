const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("helllo");
});

// 🟢 BANKER
app.get('/banker', (req, res) => {
  const code = `
#include <iostream>
using namespace std;

int main() {
    int n, m;

    cout << "Enter number of processes: ";
    cin >> n;

    cout << "Enter number of resources: ";
    cin >> m;

    int alloc[n][m], max[n][m], avail[m];
    int need[n][m];

    cout << "\nEnter Allocation Matrix:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> alloc[i][j];
        }
    }

    cout << "\nEnter Max Matrix:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> max[i][j];
        }
    }

    cout << "\nEnter Available Resources:\n";
    for (int i = 0; i < m; i++) {
        cin >> avail[i];
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            need[i][j] = max[i][j] - alloc[i][j];
        }
    }
    cout << "\nNeed Matrix:\n";
    for (int i = 0; i < n; i++) {
        cout << "P" << i << ": ";
        for (int j = 0; j < m; j++) {
            cout << need[i][j] << " ";
        }
        cout << endl;
    }

    bool finish[n] = {false};
    int safeSeq[n];
    int work[m];

    for (int i = 0; i < m; i++) {
        work[i] = avail[i];
    }

    int count = 0;

    while (count < n) {
        bool found = false;

        for (int i = 0; i < n; i++) {
            if (!finish[i]) {
                bool canExecute = true;

                for (int j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) {
                        canExecute = false;
                        break;
                    }
                }

                if (canExecute) {
                    for (int j = 0; j < m; j++) {
                        work[j] += alloc[i][j];
                    }

                    safeSeq[count++] = i;
                    finish[i] = true;
                    found = true;
                }
            }
        }

        if (!found) {
            cout << "\nSystem is NOT in safe state!\n";
            return 0;
        }
    }

    cout << "\nSystem is in SAFE state.\nSafe sequence: ";
    for (int i = 0; i < n; i++) {
        cout << "P" << safeSeq[i];
        if (i != n - 1) cout << " -> ";
    }
    cout << endl;

    return 0;
}
`;
  res.type('text/plain');
  res.send(code);
});

// 🔵 FCFS
app.get('/fcfs', (req, res) => {
  const code = `
#include<iostream>
#include<algorithm>
using namespace std;

int main(){

    int n ;
    cout<<"Enter no of processes : ";
    cin >> n;

    int pid[n],at[n],bt[n];
    int ct[n],tat[n],wt[n];

    for(int i = 0 ; i < n ; i++){
        pid[i]=i+1;
        cout<<"Enter Arrival Time of " << pid[i] << " : ";
        cin >> at[i];        
        cout<<"Enter Burst Time of " << pid[i] << " : ";
        cin >> bt[i];
    }

    for(int i = 0 ; i < n-1 ; i++){
        for(int j = i+1 ; j < n ; j++){
            if(at[i]>at[j]){
                swap(at[j],at[i]);
                swap(bt[j],bt[i]);
                swap(pid[j],pid[i]);                    
            }
        }
    }

    float avg_wt = 0,avg_tat =0;
    ct[0] = at[0]+bt[0];
    tat[0] = ct[0] - at[0];
    wt[0] = tat[0] - bt[0];
    avg_wt += wt[0];
    avg_tat += tat[0];

    for(int i = 1 ; i < n ; i++){
        if(ct[i-1] < at[i]){
            ct[i] = at[i] + bt[i];
        }
        else{
            ct[i] = ct[i-1] + bt[i];
        }

        tat[i] = ct[i] - at[i];
        wt[i] = tat[i] - bt[i];
        avg_wt += wt[i];
        avg_tat += tat[i];
    }

    cout<<"\nPID\tAT\tBT\tCT\tTAT\tWT\n";
    for (int i = 0 ; i < n ; i++){
        cout<<"P"<<pid[i]<<"\t"<<at[i]<<"\t"<<bt[i]<<"\t"<<ct[i]<<"\t"<<tat[i]<<"\t"<<wt[i]<<endl;
    }
    cout<<"avg tat : "<<avg_tat/n<<endl;
    cout<<"avg wt : "<<avg_wt/n<<endl;

    return 0;
}

`;
  res.type('text/plain');
  res.send(code);
});

// 🟣 LRU
app.get('/lru', (req, res) => {
  const code = `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, capacity;

    cout << "Enter number of pages: ";
    cin >> n;

    vector<int> pages(n);
    cout << "Enter page reference string: ";
    for (int i = 0; i < n; i++) {
        cin >> pages[i];
    }

    cout << "Enter frame capacity: ";
    cin >> capacity;

    vector<int> frames;
    int page_faults = 0, page_hits = 0;

    cout << "\nPage\tFrames\t\tStatus\n";

    for (int i = 0; i < n; i++) {
        int page = pages[i];

        auto it = find(frames.begin(), frames.end(), page);

        if (it == frames.end()) {
            page_faults++;

            if (frames.size() == capacity) {
                frames.erase(frames.begin()); 
            }

            frames.push_back(page);

            cout << page << "\t";
            for (int f : frames) cout << f << " ";
            cout << "\t\tFault\n";
        } else {
            page_hits++;

            frames.erase(it);
            frames.push_back(page);

            cout << page << "\t";
            for (int f : frames) cout << f << " ";
            cout << "\t\tHit\n";
        }
    }

    cout << "\n";
    cout << "Total Page Faults: " << page_faults << endl;
    cout << "Total Page Hits: " << page_hits << endl;

    return 0;
}
`;
  res.type('text/plain');
  res.send(code);
});

// 🟡PS
app.get('/ps', (req, res) => {
  const code = `
#include<iostream>
using namespace std;

int main(){

    int n;
    cout<<"Enter no. of processes : ";
    cin >> n;

    int pid[n],at[n],bt[n],pr[n],rt[n];
    int ct[n],tat[n],wt[n];

    for (int i = 0 ; i < n ; i++){
        pid[i] = i+1;
        cout<<"Enter Arrival time of " << pid[i] << " : ";
        cin >> at[i];        
        cout<<"Enter BUrst time of " << pid[i] << " : ";
        cin >> bt[i];
        cout<<"Enter Priority of " << pid[i] << " : ";
        cin >> pr[i];
        rt[i] = bt[i];
    }

    int completed = 0, time = 0;
    while(completed < n){
        int idx = -1, min_pr = 10000;
        for (int i = 0 ; i < n ; i++){
            if(at[i]<=time && rt[i]>0){
                if(pr[i]<min_pr){
                    min_pr = pr[i];
                    idx = i;
                }
                else if(pr[i]=min_pr){
                    if(at[i]<at[idx]){
                        idx = i;
                    }
                }
            }
        }
        if(idx == -1){
            time++;
        }
        else{
            time++;
            rt[idx]--;

            if(rt[idx] == 0){
                ct[idx]=time;
                completed++;
            }
        }
    }

    float avg_wt =0, avg_tat = 0;

    for (int i = 0 ; i < n ; i++){
        tat[i] = ct[i] - at[i];
        wt[i] = tat[i] - bt[i];
        avg_wt += wt[i];
        avg_tat += tat[i];
    }

    cout<<"\nPID\tAT\tBT\tPR\tCT\tTAT\tWT\n";
    for (int i = 0 ; i < n ; i++){
        cout<<"P"<<i+1<<"\t"<<at[i]<<"\t"<<bt[i]<<"\t"<<pr[i]<<"\t"<<ct[i]<<"\t"<<tat[i]<<"\t"<<wt[i]<<endl;
    }
    cout<<"avg tat : "<<avg_tat/n<<endl;
    cout<<"avg wt : "<<avg_wt/n<<endl;

    return 0;
}
`;
  res.type('text/plain');
  res.send(code);
});

// 🟠 SJF Algorithm
app.get('/sjf', (req, res) => {
  const code = `
#include <iostream>
using namespace std;

int main(){

    int n;
    cout<<"Enter no. of processes : ";
    cin >> n;

    int pid[n],at[n],bt[n],rt[n];
    int ct[n],tat[n],wt[n];

    for (int i = 0 ; i < n ; i++){
        pid[i] = i+1;
        cout << "Enter arrival time of " << pid[i] << " : ";
        cin >> at[i];
        cout << "Enter burst time of " << pid[i] << " : ";
        cin >> bt[i];
        rt[i] = bt[i];
    }

    int completed = 0 , time = 0;
    while(completed < n){
        int idx = -1, min_rt = 10000;
        for(int i = 0 ; i < n ; i++){
            if(at[i] <= time && rt[i] > 0){
                if(rt[i] < min_rt){
                    idx = i;
                    min_rt = rt[i];
                }
                else if(rt[i] == min_rt){
                    if(at[i] < at[idx]){
                        idx = i;
                    }
                }
            }
        }

        if(idx == -1){
            time++;
        }
        else{
            time++;
            rt[idx]--;

            if(rt[idx] == 0){
                completed++;
                ct[idx] = time;
            }
        }
    }

    float avg_wt = 0 , avg_tat = 0;

    for(int i = 0 ; i < n ; i++){
        tat[i] = ct[i] - at[i];
        wt[i] = tat[i] - bt[i];
        avg_wt += wt[i];
        avg_tat += tat[i];
    }

    cout<< "\nPID\tAT\tBT\tCT\tTAT\tWT\n";
    for(int i = 0 ; i < n ; i++){
        cout<< "P"<< i+1 <<"\t"<<at[i]<<"\t"<<bt[i]<<"\t"<<ct[i]<<"\t"<<tat[i]<<"\t"<<wt[i]<<"\n";
    }

    cout<<"Avg TAT : " <<avg_tat/n<<"\n";
    cout<<"Avg WT : " <<avg_wt/n<<"\n";

    return 0;
}


`;
  res.type('text/plain');
  res.send(code);
});

// 🔴 N-Queens
app.get('/nqueens', (req, res) => {
  const code = `
def print_grid(grid, row): 
    n = 4  # define the board size once

    if row == n: 
        # base case – all queens placed
        for r in grid:
            print(r)
        print()   # blank line between solutions
        return

    for i in range(n):
        if is_safe(grid, row, i, n):
            grid[row][i] = "Q"
            print_grid(grid, row + 1)
            grid[row][i] = " "  # backtrack


def is_safe(grid, row, col, n):
    # check column 
    for i in range(row): 
        if grid[i][col] == "Q":
            return False 

    # check left diagonal
    i, j = row - 1, col - 1
    while i >= 0 and j >= 0:
        if grid[i][j] == "Q":
            return False
        i -= 1
        j -= 1

    # check right diagonal
    i, j = row - 1, col + 1
    while i >= 0 and j < n:
        if grid[i][j] == "Q":
            return False
        i -= 1
        j += 1

    return True 


# initialize 4×4 empty board and start solving
print_grid([[" " for _ in range(4)] for _ in range(4)], 0)
`;
  res.type('text/plain');
  res.send(code);
});

app.listen(5000, () => {
  console.log("chalu thai gyu");
});